import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAnalytics } from "@/hooks/useAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Upload, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const careerFormSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
  email: z.string().email("Email inválido").max(255, "Email demasiado largo"),
  telefono: z.string().optional(),
  linkedin_url: z.string().url("URL inválida").optional().or(z.literal("")),
  puesto_solicitado: z.string().min(2, "Indica el puesto que te interesa").max(200),
  departamento: z.enum(["Fiscal", "Laboral", "Contable", "Legal", "Administración", "Tecnología", "Otro"]).optional(),
  notas: z.string().min(20, "Mínimo 20 caracteres para tu mensaje").max(1000, "Máximo 1000 caracteres"),
  privacy_consent: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar la política de privacidad para continuar",
  }),
  curriculum_policy_consent: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar la política de tratamiento de currículums para continuar",
  }),
});

type CareerFormData = z.infer<typeof careerFormSchema>;

interface CareerApplicationFormProps {
  prefilledPosition?: string;
  jobPositionId?: string;
}

export const CareerApplicationForm = ({ prefilledPosition, jobPositionId }: CareerApplicationFormProps) => {
  const { trackFormSubmit } = useAnalytics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CareerFormData>({
    resolver: zodResolver(careerFormSchema),
    defaultValues: {
      puesto_solicitado: prefilledPosition || "",
      privacy_consent: false,
      curriculum_policy_consent: false,
    },
  });

  // Prerellenar el campo cuando cambie la posición seleccionada
  useEffect(() => {
    if (prefilledPosition) {
      setValue("puesto_solicitado", prefilledPosition);
    }
  }, [prefilledPosition, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("El archivo no puede superar 5MB");
      e.target.value = "";
      return;
    }

    // Validate file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error("Solo se aceptan archivos PDF, DOC o DOCX");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const onSubmit = async (data: CareerFormData) => {
    if (!selectedFile) {
      toast.error("Por favor, adjunta tu CV");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload CV to storage
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `applications/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Error al subir el CV");
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("cvs")
        .getPublicUrl(filePath);

      // Insert candidate into database
      const { error: insertError } = await supabase.from("candidatos").insert({
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono || null,
        linkedin_url: data.linkedin_url || null,
        puesto_solicitado: data.puesto_solicitado,
        departamento: data.departamento || null,
        notas: data.notas,
        cv_url: publicUrl,
        estado: "nuevo",
        fuente: "web",
        job_position_id: jobPositionId || null,
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error("Error al guardar tu candidatura");
      }

      // Track form submission
      trackFormSubmit("carrera_aplicacion", {
        position: data.puesto_solicitado,
        job_position_id: jobPositionId || null,
        has_cv: !!publicUrl,
        has_linkedin: !!data.linkedin_url,
      });

      toast.success("¡Candidatura enviada con éxito!", {
        description: "Revisaremos tu perfil y te contactaremos pronto.",
      });

      // Reset form
      reset();
      setSelectedFile(null);
      const fileInput = document.getElementById("cv-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      toast.error(error.message || "Hubo un error al enviar tu candidatura");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre completo *</Label>
        <Input
          id="nombre"
          {...register("nombre")}
          placeholder="Tu nombre completo"
          disabled={isSubmitting}
        />
        {errors.nombre && (
          <p className="text-sm text-destructive">{errors.nombre.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="tu.email@ejemplo.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input
          id="telefono"
          type="tel"
          {...register("telefono")}
          placeholder="+34 600 000 000"
          disabled={isSubmitting}
        />
        {errors.telefono && (
          <p className="text-sm text-destructive">{errors.telefono.message}</p>
        )}
      </div>

      {/* LinkedIn */}
      <div className="space-y-2">
        <Label htmlFor="linkedin_url">LinkedIn</Label>
        <Input
          id="linkedin_url"
          type="url"
          {...register("linkedin_url")}
          placeholder="https://www.linkedin.com/in/tu-perfil"
          disabled={isSubmitting}
        />
        {errors.linkedin_url && (
          <p className="text-sm text-destructive">{errors.linkedin_url.message}</p>
        )}
      </div>

      {/* Position */}
      <div className="space-y-2">
        <Label htmlFor="puesto_solicitado">Puesto de interés *</Label>
        <Input
          id="puesto_solicitado"
          {...register("puesto_solicitado")}
          placeholder="Ej: Asesor Fiscal Senior, Contable Junior..."
          disabled={isSubmitting}
        />
        {errors.puesto_solicitado && (
          <p className="text-sm text-destructive">{errors.puesto_solicitado.message}</p>
        )}
      </div>

      {/* Department */}
      <div className="space-y-2">
        <Label htmlFor="departamento">Área / Departamento</Label>
        <Select
          onValueChange={(value) => setValue("departamento", value as any)}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fiscal">Fiscal</SelectItem>
            <SelectItem value="Laboral">Laboral</SelectItem>
            <SelectItem value="Contable">Contable</SelectItem>
            <SelectItem value="Legal">Legal</SelectItem>
            <SelectItem value="Administración">Administración</SelectItem>
            <SelectItem value="Tecnología">Tecnología</SelectItem>
            <SelectItem value="Otro">Otro</SelectItem>
          </SelectContent>
        </Select>
        {errors.departamento && (
          <p className="text-sm text-destructive">{errors.departamento.message}</p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="notas">Mensaje motivacional *</Label>
        <Textarea
          id="notas"
          {...register("notas")}
          placeholder="Cuéntanos por qué quieres unirte a nuestro equipo..."
          rows={5}
          disabled={isSubmitting}
        />
        {errors.notas && (
          <p className="text-sm text-destructive">{errors.notas.message}</p>
        )}
      </div>

      {/* CV Upload */}
      <div className="space-y-2">
        <Label htmlFor="cv-upload">CV / Currículum *</Label>
        <div className="flex items-center gap-4">
          <Input
            id="cv-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={isSubmitting}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("cv-upload")?.click()}
            disabled={isSubmitting}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {selectedFile ? "Cambiar archivo" : "Seleccionar CV"}
          </Button>
        </div>
        {selectedFile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{selectedFile.name}</span>
            <span className="text-xs">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Formatos aceptados: PDF, DOC, DOCX (máx. 5MB)
        </p>
      </div>

      {/* Consentimientos explícitos */}
      <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border/50">
        <p className="text-sm font-medium text-foreground mb-3">
          Consentimientos requeridos
        </p>
        
        {/* Checkbox Política de Privacidad */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="privacy_consent"
            {...register("privacy_consent")}
            disabled={isSubmitting}
            className="mt-1"
          />
          <div className="flex-1 space-y-1">
            <Label
              htmlFor="privacy_consent"
              className="text-sm font-normal cursor-pointer leading-relaxed"
            >
              He leído y acepto la{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Política de Privacidad
              </a>{" "}
              de NRRO *
            </Label>
            {errors.privacy_consent && (
              <p className="text-sm text-destructive">
                {errors.privacy_consent.message}
              </p>
            )}
          </div>
        </div>

        {/* Checkbox Política de Currículums */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="curriculum_policy_consent"
            {...register("curriculum_policy_consent")}
            disabled={isSubmitting}
            className="mt-1"
          />
          <div className="flex-1 space-y-1">
            <Label
              htmlFor="curriculum_policy_consent"
              className="text-sm font-normal cursor-pointer leading-relaxed"
            >
              Acepto la{" "}
              <a
                href="/legal#politica-curriculum"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Política de Envío y Recepción de Currículums
              </a>{" "}
              y autorizo el tratamiento de mis datos personales para procesos de selección durante 1 año *
            </Label>
            {errors.curriculum_policy_consent && (
              <p className="text-sm text-destructive">
                {errors.curriculum_policy_consent.message}
              </p>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          * Campos obligatorios. Puedes ejercer tus derechos ARCO-POL contactando a{" "}
          <a href="mailto:info@nrro.es" className="text-accent hover:underline">
            info@nrro.es
          </a>
        </p>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar candidatura"
        )}
      </Button>
    </form>
  );
};
