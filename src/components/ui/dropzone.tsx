import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  Accept,
  FileRejection,
  useDropzone as rootUseDropzone,
} from "react-dropzone";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";

type DropzoneResult<TUploadRes, TUploadError> =
  | {
      status: "pending";
    }
  | {
      status: "error";
      error: TUploadError;
    }
  | {
      status: "success";
      result: TUploadRes;
    };

export type FileStatus<TUploadRes, TUploadError> = {
  id: string;
  fileName: string;
  file: File;
  tries: number;
} & (
  | {
      status: "pending";
      result?: undefined;
      error?: undefined;
    }
  | {
      status: "error";
      error: TUploadError;
      result?: undefined;
    }
  | {
      status: "success";
      result: TUploadRes;
      error?: undefined;
    }
);

type FileStatusAction<TUploadRes, TUploadError> =
  | {
      type: "add";
      id: string;
      fileName: string;
      file: File;
    }
  | {
      type: "remove";
      id: string;
    }
  | {
      type: "update-status";
      id: string;
      status: "pending";
    }
  | {
      type: "update-status";
      id: string;
      status: "error";
      error: TUploadError;
    }
  | {
      type: "update-status";
      id: string;
      status: "success";
      result: TUploadRes;
    };

const fileStatusReducer = <TUploadRes, TUploadError>(
  state: FileStatus<TUploadRes, TUploadError>[],
  action: FileStatusAction<TUploadRes, TUploadError>
): FileStatus<TUploadRes, TUploadError>[] => {
  switch (action.type) {
    case "add":
      return [
        ...state,
        {
          id: action.id,
          fileName: action.fileName,
          file: action.file,
          status: "pending",
          tries: 1,
        },
      ];
    case "remove":
      return state.filter((fileStatus) => fileStatus.id !== action.id);
    case "update-status":
      return state.map((fileStatus) => {
        if (fileStatus.id === action.id) {
          if (action.status === "pending") {
            return {
              ...fileStatus,
              status: "pending" as const,
              tries: fileStatus.tries + 1,
              result: undefined,
              error: undefined,
            };
          } else if (action.status === "error") {
            return {
              ...fileStatus,
              status: "error" as const,
              error: action.error,
              result: undefined,
            };
          } else if (action.status === "success") {
            return {
              ...fileStatus,
              status: "success" as const,
              result: action.result,
              error: undefined,
            };
          }
        }
        return fileStatus;
      });
  }
};

type DropZoneErrorCode = (typeof dropZoneErrorCodes)[number];
const dropZoneErrorCodes = [
  "file-invalid-type",
  "file-too-large",
  "file-too-small",
  "too-many-files",
] as const;

const getDropZoneErrorCodes = (fileRejections: FileRejection[]) => {
  const errors = fileRejections.map((rejection) => {
    return rejection.errors
      .filter((error) =>
        dropZoneErrorCodes.includes(error.code as DropZoneErrorCode)
      )
      .map((error) => error.code as DropZoneErrorCode);
  });
  return Array.from(new Set(errors.flat()));
};

const getRootError = (
  errorCodes: DropZoneErrorCode[],
  limits: {
    accept?: Accept;
    maxSize?: number;
    minSize?: number;
    maxFiles?: number;
  }
) => {
  const errors = errorCodes.map((error) => {
    switch (error) {
      case "file-invalid-type":
        const acceptedTypes = Object.values(limits.accept ?? {})
          .flat()
          .join(", ");
        return `only ${acceptedTypes} are allowed`;
      case "file-too-large":
        const maxMb = limits.maxSize
          ? (limits.maxSize / (1024 * 1024)).toFixed(2)
          : "infinite?";
        return `max size is ${maxMb}MB`;
      case "file-too-small":
        const roundedMinSize = limits.minSize
          ? (limits.minSize / (1024 * 1024)).toFixed(2)
          : "negative?";
        return `min size is ${roundedMinSize}MB`;
      case "too-many-files":
        return `max ${limits.maxFiles} files`;
    }
  });
  const joinedErrors = errors.join(", ");
  return joinedErrors.charAt(0).toUpperCase() + joinedErrors.slice(1);
};

type UseDropzoneProps<TUploadRes, TUploadError> = {
  onDropFile: (
    file: File
  ) => Promise<
    Exclude<DropzoneResult<TUploadRes, TUploadError>, { status: "pending" }>
  >;
  onRemoveFile?: (id: string) => void | Promise<void>;
  onFileUploaded?: (result: TUploadRes) => void;
  onFileUploadError?: (error: TUploadError) => void;
  onAllUploaded?: () => void;
  onRootError?: (error: string | undefined) => void;
  maxRetryCount?: number;
  autoRetry?: boolean;
  validation?: {
    accept?: Accept;
    minSize?: number;
    maxSize?: number;
    maxFiles?: number;
  };
  shiftOnMaxFiles?: boolean;
} & (TUploadError extends string
  ? {
      shapeUploadError?: (error: TUploadError) => string;
    }
  : {
      shapeUploadError: (error: TUploadError) => string;
    });

interface UseDropzoneReturn<TUploadRes, TUploadError> {
  getRootProps: ReturnType<typeof rootUseDropzone>["getRootProps"];
  getInputProps: ReturnType<typeof rootUseDropzone>["getInputProps"];
  onRemoveFile: (id: string) => Promise<void>;
  onRetry: (id: string) => Promise<void>;
  canRetry: (id: string) => boolean;
  fileStatuses: FileStatus<TUploadRes, TUploadError>[];
  isInvalid: boolean;
  isDragActive: boolean;
  rootError: string | undefined;
  inputId: string;
  rootMessageId: string;
  rootDescriptionId: string;
  getFileMessageId: (id: string) => string;
}

const useDropzone = <TUploadRes, TUploadError = string>(
  props: UseDropzoneProps<TUploadRes, TUploadError>
): UseDropzoneReturn<TUploadRes, TUploadError> => {
  const {
    onDropFile: pOnDropFile,
    onRemoveFile: pOnRemoveFile,
    shapeUploadError: pShapeUploadError,
    onFileUploaded: pOnFileUploaded,
    onFileUploadError: pOnFileUploadError,
    onAllUploaded: pOnAllUploaded,
    onRootError: pOnRootError,
    maxRetryCount,
    autoRetry,
    validation,
    shiftOnMaxFiles,
  } = props;

  const inputId = useId();
  const rootMessageId = `${inputId}-root-message`;
  const rootDescriptionId = `${inputId}-description`;
  const [rootError, _setRootError] = useState<string | undefined>(undefined);

  const setRootError = useCallback(
    (error: string | undefined) => {
      _setRootError(error);
      if (pOnRootError !== undefined) {
        pOnRootError(error);
      }
    },
    [pOnRootError, _setRootError]
  );

  const [fileStatuses, dispatch] = useReducer(
    fileStatusReducer<TUploadRes, TUploadError>,
    [] as FileStatus<TUploadRes, TUploadError>[]
  );

  const isInvalid = useMemo(() => {
    return (
      fileStatuses.filter((file) => file.status === "error").length > 0 ||
      rootError !== undefined
    );
  }, [fileStatuses, rootError]);

  const _uploadFile = useCallback(
    async (file: File, id: string, tries = 0) => {
      const result = await pOnDropFile(file);

      if (result.status === "error") {
        if (autoRetry === true && tries < (maxRetryCount ?? Infinity)) {
          dispatch({ type: "update-status", id, status: "pending" });
          return _uploadFile(file, id, tries + 1);
        }

        // Handle error shaping more carefully
        let finalError: TUploadError;
        if (pShapeUploadError) {
          const shapedError = pShapeUploadError(result.error);
          // If shaping returns a string and TUploadError extends string, use it
          // Otherwise fall back to original error
          finalError = (
            typeof shapedError === "string" && typeof result.error === "string"
              ? shapedError
              : result.error
          ) as TUploadError;
        } else {
          finalError = result.error;
        }

        dispatch({
          type: "update-status",
          id,
          status: "error",
          error: finalError,
        });
        pOnFileUploadError?.(finalError);
        return;
      }

      pOnFileUploaded?.(result.result);
      dispatch({
        type: "update-status",
        id,
        status: "success",
        result: result.result,
      });
    },
    [
      autoRetry,
      maxRetryCount,
      pOnDropFile,
      pShapeUploadError,
      pOnFileUploadError,
      pOnFileUploaded,
    ]
  );

  const onRemoveFile = useCallback(
    async (id: string) => {
      await pOnRemoveFile?.(id);
      dispatch({ type: "remove", id });
    },
    [pOnRemoveFile]
  );

  const canRetry = useCallback(
    (id: string) => {
      const fileStatus = fileStatuses.find((file) => file.id === id);
      return (
        fileStatus?.status === "error" &&
        fileStatus.tries < (maxRetryCount ?? Infinity)
      );
    },
    [fileStatuses, maxRetryCount]
  );

  const onRetry = useCallback(
    async (id: string) => {
      if (!canRetry(id)) {
        return;
      }
      dispatch({ type: "update-status", id, status: "pending" });
      const fileStatus = fileStatuses.find((file) => file.id === id);
      if (!fileStatus || fileStatus.status !== "error") {
        return;
      }
      await _uploadFile(fileStatus.file, id);
    },
    [canRetry, fileStatuses, _uploadFile]
  );

  const getFileMessageId = (id: string) => `${inputId}-${id}-message`;

  const dropzone = rootUseDropzone({
    accept: validation?.accept,
    minSize: validation?.minSize,
    maxSize: validation?.maxSize,
    maxFiles: validation?.maxFiles,
    onDropAccepted: async (newFiles) => {
      setRootError(undefined);

      // useDropzone hook only checks max file count per group of uploaded files, allows going over if in multiple batches
      const fileCount = fileStatuses.length;
      const maxNewFiles =
        validation?.maxFiles === undefined
          ? Infinity
          : validation?.maxFiles - fileCount;

      if (maxNewFiles < newFiles.length) {
        if (shiftOnMaxFiles !== true) {
          setRootError(getRootError(["too-many-files"], validation ?? {}));
        }
      }

      const slicedNewFiles =
        shiftOnMaxFiles === true ? newFiles : newFiles.slice(0, maxNewFiles);

      const onDropFilePromises = slicedNewFiles.map(async (file, index) => {
        if (fileCount + 1 > maxNewFiles) {
          await onRemoveFile(fileStatuses[index].id);
        }

        const id =
          typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `dz-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        dispatch({ type: "add", fileName: file.name, file, id });
        await _uploadFile(file, id);
      });

      await Promise.all(onDropFilePromises);
      pOnAllUploaded?.();
    },
    onDropRejected: (fileRejections) => {
      const errorMessage = getRootError(
        getDropZoneErrorCodes(fileRejections),
        validation ?? {}
      );
      setRootError(errorMessage);
    },
  });

  return {
    getRootProps: dropzone.getRootProps,
    getInputProps: dropzone.getInputProps,
    inputId,
    rootMessageId,
    rootDescriptionId,
    getFileMessageId,
    onRemoveFile,
    onRetry,
    canRetry,
    fileStatuses,
    isInvalid,
    rootError,
    isDragActive: dropzone.isDragActive,
  };
};

// Properly typed context with generics
interface DropZoneContextType<TUploadRes, TUploadError> {
  getRootProps: () => Record<string, unknown>;
  getInputProps: () => Record<string, unknown>;
  onRemoveFile: (id: string) => Promise<void>;
  onRetry: (id: string) => Promise<void>;
  canRetry: (id: string) => boolean;
  fileStatuses: FileStatus<TUploadRes, TUploadError>[];
  isInvalid: boolean;
  isDragActive: boolean;
  rootError: string | undefined;
  inputId: string;
  rootMessageId: string;
  rootDescriptionId: string;
  getFileMessageId: (id: string) => string;
}

const createDropZoneContext = <TUploadRes, TUploadError>() => {
  return createContext<DropZoneContextType<TUploadRes, TUploadError> | null>(
    null
  );
};

// Use a factory function to create properly typed contexts
const DropZoneContext = createDropZoneContext<unknown, unknown>();

const useDropzoneContext = <TUploadRes, TUploadError>(): UseDropzoneReturn<
  TUploadRes,
  TUploadError
> => {
  const context = useContext(DropZoneContext);
  if (!context) {
    throw new Error("useDropzoneContext must be used within a Dropzone");
  }
  return context as UseDropzoneReturn<TUploadRes, TUploadError>;
};

interface DropzoneProps<TUploadRes, TUploadError> {
  children: React.ReactNode;
  value: UseDropzoneReturn<TUploadRes, TUploadError>;
}

const Dropzone = <TUploadRes, TUploadError>({
  children,
  value,
}: DropzoneProps<TUploadRes, TUploadError>) => {
  return (
    <DropZoneContext.Provider value={value}>
      {children}
    </DropZoneContext.Provider>
  );
};
Dropzone.displayName = "Dropzone";

type DropZoneAreaProps = React.HTMLAttributes<HTMLDivElement>;

const DropZoneArea = forwardRef<HTMLDivElement, DropZoneAreaProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const context = useDropzoneContext();

    const { onFocus, onBlur, onDragEnter, onDragLeave, onDrop, ref } =
      context.getRootProps();

    return (
      <div
        ref={(instance) => {
          if (ref && "current" in ref) {
            ref.current = instance;
          }
          if (typeof forwardedRef === "function") {
            forwardedRef(instance);
          } else if (forwardedRef) {
            forwardedRef.current = instance;
          }
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        {...props}
        aria-label="dropzone"
        className={cn(
          "flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          context.isDragActive && "animate-pulse bg-black/5",
          context.isInvalid && "border-destructive",
          className
        )}
      >
        {children}
      </div>
    );
  }
);
DropZoneArea.displayName = "DropZoneArea";

export type DropzoneDescriptionProps =
  React.HTMLAttributes<HTMLParagraphElement>;

const DropzoneDescription = forwardRef<
  HTMLParagraphElement,
  DropzoneDescriptionProps
>((props, ref) => {
  const { className, ...rest } = props;
  const context = useDropzoneContext();

  return (
    <p
      ref={ref}
      id={context.rootDescriptionId}
      {...rest}
      className={cn("pb-1 text-sm text-muted-foreground", className)}
    />
  );
});
DropzoneDescription.displayName = "DropzoneDescription";

interface DropzoneFileListContext<TUploadRes, TUploadError> {
  onRemoveFile: () => Promise<void>;
  onRetry: () => Promise<void>;
  fileStatus: FileStatus<TUploadRes, TUploadError>;
  canRetry: boolean;
  dropzoneId: string;
  messageId: string;
}

const createDropzoneFileListContext = <TUploadRes, TUploadError>() => {
  return createContext<DropzoneFileListContext<
    TUploadRes,
    TUploadError
  > | null>(null);
};

const DropzoneFileListContext = createDropzoneFileListContext<
  unknown,
  unknown
>();

const useDropzoneFileListContext = <
  TUploadRes = unknown,
  TUploadError = unknown
>(): DropzoneFileListContext<TUploadRes, TUploadError> => {
  const context = useContext(DropzoneFileListContext);
  if (!context) {
    throw new Error(
      "useDropzoneFileListContext must be used within a DropzoneFileListItem"
    );
  }
  return context as DropzoneFileListContext<TUploadRes, TUploadError>;
};

type DropZoneFileListProps = React.OlHTMLAttributes<HTMLOListElement>;

const DropzoneFileList = forwardRef<HTMLOListElement, DropZoneFileListProps>(
  (props, ref) => {
    return (
      <ol
        ref={ref}
        aria-label="dropzone-file-list"
        {...props}
        className={cn("flex flex-col gap-4", props.className)}
      >
        {props.children}
      </ol>
    );
  }
);
DropzoneFileList.displayName = "DropzoneFileList";

interface DropzoneFileListItemProps<TUploadRes, TUploadError>
  extends React.LiHTMLAttributes<HTMLLIElement> {
  file: FileStatus<TUploadRes, TUploadError>;
}

const DropzoneFileListItem = <TUploadRes, TUploadError>({
  className,
  file,
  children,
  ...props
}: DropzoneFileListItemProps<TUploadRes, TUploadError>) => {
  const fileId = file.id;
  const {
    onRemoveFile: cOnRemoveFile,
    onRetry: cOnRetry,
    getFileMessageId: cGetFileMessageId,
    canRetry: cCanRetry,
    inputId: cInputId,
  } = useDropzoneContext<TUploadRes, TUploadError>();

  const onRemoveFile = useCallback(
    () => cOnRemoveFile(fileId),
    [fileId, cOnRemoveFile]
  );
  const onRetry = useCallback(() => cOnRetry(fileId), [fileId, cOnRetry]);
  const messageId = cGetFileMessageId(fileId);
  const isInvalid = file.status === "error";
  const canRetry = useMemo(() => cCanRetry(fileId), [fileId, cCanRetry]);

  const contextValue: DropzoneFileListContext<TUploadRes, TUploadError> = {
    onRemoveFile,
    onRetry,
    fileStatus: file,
    canRetry,
    dropzoneId: cInputId,
    messageId,
  };

  return (
    <DropzoneFileListContext.Provider value={contextValue}>
      <li
        aria-label="dropzone-file-list-item"
        aria-describedby={isInvalid ? messageId : undefined}
        className={cn(
          "flex flex-col justify-center gap-2 rounded-md bg-muted/40 px-4 py-2",
          className
        )}
        {...props}
      >
        {children}
      </li>
    </DropzoneFileListContext.Provider>
  );
};
DropzoneFileListItem.displayName = "DropzoneFileListItem";

type DropzoneFileMessageProps = React.HTMLAttributes<HTMLParagraphElement>;

const DropzoneFileMessage = forwardRef<
  HTMLParagraphElement,
  DropzoneFileMessageProps
>((props, ref) => {
  const { children, ...rest } = props;
  const context = useDropzoneFileListContext();

  const body =
    context.fileStatus.status === "error"
      ? String(context.fileStatus.error)
      : children;
  return (
    <p
      ref={ref}
      id={context.messageId}
      {...rest}
      className={cn(
        "h-5 text-[0.8rem] font-medium text-destructive",
        rest.className
      )}
    >
      {body}
    </p>
  );
});
DropzoneFileMessage.displayName = "DropzoneFileMessage";

type DropzoneMessageProps = React.HTMLAttributes<HTMLParagraphElement>;

const DropzoneMessage = forwardRef<HTMLParagraphElement, DropzoneMessageProps>(
  (props, ref) => {
    const { children, ...rest } = props;
    const context = useDropzoneContext();

    const body = context.rootError ? String(context.rootError) : children;
    return (
      <p
        ref={ref}
        id={context.rootMessageId}
        {...rest}
        className={cn(
          "h-5 text-[0.8rem] font-medium text-destructive",
          rest.className
        )}
      >
        {body}
      </p>
    );
  }
);
DropzoneMessage.displayName = "DropzoneMessage";

type DropzoneRemoveFileProps = ButtonProps;

const DropzoneRemoveFile = forwardRef<
  HTMLButtonElement,
  DropzoneRemoveFileProps
>(({ className, ...props }, ref) => {
  const context = useDropzoneFileListContext();
  return (
    <Button
      ref={ref}
      onClick={context.onRemoveFile}
      type="button"
      size="icon"
      {...props}
      className={cn(
        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
        className
      )}
    >
      {props.children}
      <span className="sr-only">Remove file</span>
    </Button>
  );
});
DropzoneRemoveFile.displayName = "DropzoneRemoveFile";

type DropzoneRetryFileProps = ButtonProps;

const DropzoneRetryFile = forwardRef<HTMLButtonElement, DropzoneRetryFileProps>(
  ({ className, ...props }, ref) => {
    const context = useDropzoneFileListContext();
    const canRetry = context.canRetry;

    return (
      <Button
        ref={ref}
        aria-disabled={!canRetry}
        aria-label="retry"
        onClick={context.onRetry}
        type="button"
        size="icon"
        {...props}
        className={cn(
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className
        )}
      >
        {props.children}
        <span className="sr-only">Retry</span>
      </Button>
    );
  }
);
DropzoneRetryFile.displayName = "DropzoneRetryFile";

type DropzoneTriggerProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const DropzoneTrigger = forwardRef<HTMLLabelElement, DropzoneTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = useDropzoneContext();
    const { fileStatuses, getFileMessageId } = context;

    const fileMessageIds = useMemo(
      () =>
        fileStatuses
          .filter((file) => file.status === "error")
          .map((file) => getFileMessageId(file.id)),
      [fileStatuses, getFileMessageId]
    );

    return (
      <label
        ref={ref}
        {...props}
        className={cn(
          "cursor-pointer rounded-sm bg-secondary px-4 py-2 font-medium ring-offset-background transition-colors focus-within:outline-none hover:bg-secondary/80 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2",
          className
        )}
      >
        {children}
        <input
          {...context.getInputProps({
            style: {
              display: undefined,
            },
            className: "sr-only",
            tabIndex: undefined,
          })}
          aria-describedby={
            context.isInvalid
              ? [context.rootMessageId, ...fileMessageIds].join(" ")
              : undefined
          }
          aria-invalid={context.isInvalid}
        />
      </label>
    );
  }
);
DropzoneTrigger.displayName = "DropzoneTrigger";

interface InfiniteProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "pending" | "success" | "error";
}

const valueTextMap = {
  pending: "indeterminate",
  success: "100%",
  error: "error",
} as const;

const InfiniteProgress = forwardRef<HTMLDivElement, InfiniteProgressProps>(
  ({ className, status, ...props }, ref) => {
    const done = status === "success" || status === "error";
    const error = status === "error";
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={valueTextMap[status]}
        {...props}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-muted",
          className
        )}
      >
        <div
          className={cn(
            "h-full w-full rounded-full bg-primary",
            done ? "translate-x-0" : "animate-infinite-progress",
            error && "bg-destructive"
          )}
        />
      </div>
    );
  }
);
InfiniteProgress.displayName = "InfiniteProgress";

export {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneFileMessage,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneRetryFile,
  DropzoneTrigger,
  InfiniteProgress,
  useDropzone,
};
