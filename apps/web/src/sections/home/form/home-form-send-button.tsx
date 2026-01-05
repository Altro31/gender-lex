import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useFormState } from "react-hook-form";

interface Props {
  disabled?: boolean;
}

export default function HomeFormSendButton({ disabled = false }: Props) {
  const { isSubmitting, isValid } = useFormState();

  return (
    <Button
      size="icon"
      className="cursor-pointer rounded-lg transition-opacity"
      disabled={!isValid || isSubmitting}
      type="submit"
    >
      {isSubmitting ? <Loader2 className="animate-spin" /> : <Upload />}
    </Button>
  );
}
