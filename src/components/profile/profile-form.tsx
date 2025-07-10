"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Plus,
  Trash2,
  User,
  MapPin,
  Phone,
  Globe,
  Github,
  Linkedin,
  Briefcase,
  CalendarIcon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { ProfileFormData, profileSchema } from "@/lib/zod-schemas";
import { toast } from "sonner";
import { addProfile } from "@/actions/profile.actions";
import { useAction } from "next-safe-action/hooks";
import z from "zod";

type WorkExperience = NonNullable<
  z.infer<typeof profileSchema>["workExperience"]
>[number];

interface ProfileFormProps {
  userEmail: string;
  initialData?: Partial<ProfileFormData>;
}

const isDev = process.env.NODE_ENV === "development";

export default function ProfileForm({
  userEmail,
  initialData,
}: ProfileFormProps) {
  const [newSkill, setNewSkill] = useState("");
  const [newAchievement, setNewAchievement] = useState("");

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialData?.fullName || (isDev ? "John Doe" : ""),
      phone: initialData?.phone || (isDev ? "123-456-7890" : ""),
      email: userEmail,
      location: initialData?.location || (isDev ? "Mumbai, India" : ""),
      linkedinUrl:
        initialData?.linkedinUrl ||
        (isDev ? "https://linkedin.com/in/johndoe" : ""),
      websiteUrl:
        initialData?.websiteUrl || (isDev ? "https://johndoe.dev" : ""),
      githubUrl:
        initialData?.githubUrl || (isDev ? "https://github.com/johndoe" : ""),
      currentJobTitle:
        initialData?.currentJobTitle || (isDev ? "Full Stack Developer" : ""),
      yearsOfExperience: initialData?.yearsOfExperience || (isDev ? 3 : 0),
      bio:
        initialData?.bio ||
        (isDev
          ? "Passionate developer with 3+ years of experience building full-stack web apps."
          : ""),
      workExperience:
        initialData?.workExperience?.map((exp: WorkExperience) => ({
          title: exp.title,
          company: exp.company,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          summary: exp.summary,
        })) ||
        (isDev
          ? [
              {
                title: "Frontend Developer",
                company: "TechCorp",
                startDate: new Date("2022-01-01"),
                endDate: new Date("2023-12-31"),
                summary: "Worked on building modern React applications.",
              },
            ]
          : []),
      skills:
        initialData?.skills ||
        (isDev ? ["React", "Next.js", "Node.js", "TypeScript"] : []),
      achievements:
        initialData?.achievements ||
        (isDev ? ["Won Hackathon 2023", "Built a SaaS product"] : []),
    },
  });

  const {
    fields: workExperienceFields,
    append: appendWorkExperience,
    remove: removeWorkExperience,
  } = useFieldArray({
    control: form.control,
    name: "workExperience",
  });

  const skills = useMemo(() => form.watch("skills") || [], [form]);
  const achievements = useMemo(() => form.watch("achievements") || [], [form]);

  const { execute, isExecuting } = useAction(addProfile, {
    onSuccess: () => {
      toast.success("Profile saved successfully!");
    },
    onError: (error) => {
      toast.error("Failed to save profile");
      console.error("Profile save error:", error);
    },
  });

  const addSkill = useCallback(() => {
    if (newSkill.trim()) {
      const currentSkills = form.getValues("skills") || [];
      form.setValue("skills", [...currentSkills, newSkill.trim()]);
      setNewSkill("");
    }
  }, [form, newSkill]);

  const removeSkill = useCallback(
    (index: number) => {
      const currentSkills = form.getValues("skills") || [];
      form.setValue(
        "skills",
        currentSkills.filter((_, i) => i !== index)
      );
    },
    [form]
  );

  const addAchievement = useCallback(() => {
    if (newAchievement.trim()) {
      const currentAchievements = form.getValues("achievements") || [];
      form.setValue("achievements", [
        ...currentAchievements,
        newAchievement.trim(),
      ]);
      setNewAchievement("");
    }
  }, [form, newAchievement]);

  const removeAchievement = useCallback(
    (index: number) => {
      const currentAchievements = form.getValues("achievements") || [];
      form.setValue(
        "achievements",
        currentAchievements.filter((_, i) => i !== index)
      );
    },
    [form]
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">Complete Your Profile</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Help us create better cover letters by providing your professional
          details
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(execute)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          disabled={isExecuting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 123-4567"
                          {...field}
                          disabled={isExecuting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="New York, NY"
                        {...field}
                        disabled={isExecuting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Online Presence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Online Presence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/johndoe"
                        {...field}
                        disabled={isExecuting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        Website URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://johndoe.com"
                          {...field}
                          disabled={isExecuting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Github className="h-4 w-4" />
                        GitHub URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/johndoe"
                          {...field}
                          disabled={isExecuting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentJobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Job Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Software Engineer"
                          {...field}
                          disabled={isExecuting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="3"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          disabled={isExecuting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your professional background and expertise..."
                        rows={4}
                        {...field}
                        disabled={isExecuting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {workExperienceFields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No work experience added yet.</p>
                  <p className="text-sm">
                    Click the button below to add your first work experience.
                  </p>
                </div>
              )}
              {workExperienceFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 p-4 border rounded-lg relative"
                >
                  {workExperienceFields.length >= 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      onClick={() => removeWorkExperience(index)}
                      aria-label={`Remove work experience ${index + 1}`}
                      disabled={isExecuting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`workExperience.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Software Engineer"
                              {...field}
                              disabled={isExecuting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`workExperience.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tech Corp"
                              {...field}
                              disabled={isExecuting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`workExperience.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 bg-white"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`workExperience.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 bg-white"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`workExperience.${index}.summary`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Summary *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your role, responsibilities, and achievements..."
                            rows={3}
                            {...field}
                            disabled={isExecuting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                aria-label="Add Work Experience"
                onClick={() =>
                  appendWorkExperience({
                    title: "",
                    company: "",
                    startDate: new Date(),
                    endDate: undefined,
                    summary: "",
                  })
                }
                disabled={isExecuting}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Work Experience
              </Button>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                  disabled={isExecuting}
                />
                <Button
                  type="button"
                  onClick={addSkill}
                  variant="outline"
                  aria-label="Add Skill"
                  disabled={isExecuting}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    <Button
                      variant="ghost"
                      onClick={() => removeSkill(index)}
                      aria-label={`remove skill ${skill}`}
                      className="ml-1 cursor-pointer hover:bg-red-600 hover:text-white"
                      tabIndex={-1}
                      disabled={isExecuting}
                    >
                      <X className="h-3 w-3 " />
                    </Button>
                  </Badge>
                ))}
              </div>
              {form.formState.errors.skills && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.skills.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter an achievement"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  disabled={isExecuting}
                />
                <Button
                  type="button"
                  onClick={addAchievement}
                  variant="outline"
                  aria-label="Add Achievement"
                  disabled={isExecuting}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-muted rounded"
                  >
                    <span className="flex-1">{achievement}</span>
                    <X
                      className="h-4 w-4 cursor-pointer hover:text-red-500"
                      onClick={() => removeAchievement(index)}
                      aria-label={`remove achievement ${achievement}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
            disabled={isExecuting}
          >
            Save Profile
          </Button>
        </form>
      </Form>
    </div>
  );
}
