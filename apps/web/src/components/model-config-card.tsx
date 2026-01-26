import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ModelConfig {
  modelId: string;
  modelName: string;
  role: "primary" | "secondary" | "tertiary";
  parameters: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    systemPrompt?: string;
  };
}

interface ModelConfigCardProps {
  model: ModelConfig;
  availableModels: Array<{ id: string; name: string; provider: string }>;
  roleOptions: Array<{ value: string; label: string }>;
  onUpdate: (model: ModelConfig) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export default function ModelConfigCard({
  model,
  availableModels,
  roleOptions,
  onUpdate,
  onRemove,
  canRemove,
}: ModelConfigCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateModel = (updates: Partial<ModelConfig>) => {
    onUpdate({ ...model, ...updates });
  };

  const updateParameters = (
    paramUpdates: Partial<ModelConfig["parameters"]>
  ) => {
    onUpdate({
      ...model,
      parameters: { ...model.parameters, ...paramUpdates },
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "primary":
        return "border-blue-200 bg-blue-50";
      case "secondary":
        return "border-green-200 bg-green-50";
      case "tertiary":
        return "border-purple-200 bg-purple-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <Card className={`${getRoleColor(model.role)} transition-all duration-200`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">
              {model.modelName || "Modelo sin configurar"} -{" "}
              {roleOptions.find((r) => r.value === model.role)?.label}
            </CardTitle>
            <CardDescription className="text-sm">
              {model.parameters.temperature !== undefined &&
                `Temperatura: ${model.parameters.temperature}`}
              {model.parameters.maxTokens &&
                ` • Tokens: ${model.parameters.maxTokens}`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger
                className="h-8 w-8 p-0"
                render={<Button variant="ghost" size="sm" />}
              >
                {isExpanded ? <ChevronUp /> : <ChevronDown />}
              </CollapsibleTrigger>
            </Collapsible>
            {canRemove && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                onClick={onRemove}
              >
                <Trash2 />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Configuration */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Modelo *</Label>
            <Select
              value={model.modelId}
              onValueChange={(value) => {
                const selectedModel = availableModels.find(
                  (m) => m.id === value
                );
                updateModel({
                  modelId: value!,
                  modelName: selectedModel?.name || "",
                });
              }}
            >
              <SelectTrigger
              // placeholder="Selecciona un modelo"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((availableModel) => (
                  <SelectItem key={availableModel.id} value={availableModel.id}>
                    {availableModel.name} ({availableModel.provider})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rol *</Label>
            <Select
              value={model.role}
              onValueChange={(value: any) => updateModel({ role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-4">
            {/* Advanced Parameters */}
            <div className="border-t pt-4">
              <h4 className="mb-4 font-medium">Parámetros Avanzados</h4>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Temperature */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Temperatura</Label>
                    <span className="text-sm text-gray-600">
                      {model.parameters.temperature}
                    </span>
                  </div>
                  <Slider
                    value={[model.parameters.temperature]}
                    onValueChange={(value) =>
                      updateParameters({
                        temperature: (value as readonly number[])[0],
                      })
                    }
                    max={2}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Controla la creatividad de las respuestas
                  </p>
                </div>

                {/* Max Tokens */}
                <div className="space-y-2">
                  <Label>Tokens Máximos</Label>
                  <Input
                    type="number"
                    value={model.parameters.maxTokens}
                    onChange={(e) =>
                      updateParameters({
                        maxTokens: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    min={1}
                    max={8000}
                  />
                  <p className="text-xs text-gray-500">
                    Límite de tokens en la respuesta
                  </p>
                </div>

                {/* Top P */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Top P</Label>
                    <span className="text-sm text-gray-600">
                      {model.parameters.topP}
                    </span>
                  </div>
                  <Slider
                    value={[model.parameters.topP]}
                    onValueChange={(value) =>
                      updateParameters({
                        topP: (value as readonly number[])[0],
                      })
                    }
                    max={1}
                    min={0}
                    step={0.05}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Controla la diversidad del vocabulario
                  </p>
                </div>

                {/* Frequency Penalty */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Penalización de Frecuencia</Label>
                    <span className="text-sm text-gray-600">
                      {model.parameters.frequencyPenalty}
                    </span>
                  </div>
                  <Slider
                    value={[model.parameters.frequencyPenalty]}
                    onValueChange={(value) =>
                      updateParameters({
                        frequencyPenalty: (value as readonly number[])[0],
                      })
                    }
                    max={2}
                    min={-2}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Reduce repetición de palabras frecuentes
                  </p>
                </div>

                {/* Presence Penalty */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Penalización de Presencia</Label>
                    <span className="text-sm text-gray-600">
                      {model.parameters.presencePenalty}
                    </span>
                  </div>
                  <Slider
                    value={[model.parameters.presencePenalty]}
                    onValueChange={(value) =>
                      updateParameters({
                        presencePenalty: (value as readonly number[])[0],
                      })
                    }
                    max={2}
                    min={-2}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Fomenta hablar sobre nuevos temas
                  </p>
                </div>
              </div>

              {/* System Prompt */}
              <div className="mt-4 space-y-2">
                <Label>Prompt del Sistema</Label>
                <Textarea
                  value={model.parameters.systemPrompt || ""}
                  onChange={(e) =>
                    updateParameters({
                      systemPrompt: e.target.value,
                    })
                  }
                  placeholder="Define el comportamiento y personalidad del modelo..."
                  rows={4}
                />
                <p className="text-xs text-gray-500">
                  Instrucciones que definen el comportamiento del modelo
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
