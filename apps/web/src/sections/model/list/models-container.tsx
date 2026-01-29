import SearchInput, { SearchInputFallback } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { t } from "@lingui/core/macro";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import {
  CreateModelDialog,
  CreateModelDialogTrigger,
} from "../components/dialogs/create-model-dialog";
import { DeleteModelAlertDialog } from "../components/dialogs/delete-model-alert-dialog";
import { DetailsModelDialog } from "../components/dialogs/details-model-dialog";
import { EditModelDialog } from "../components/dialogs/edit-model-dialog";
import ModelListsContainer from "./model-list-container";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default function ModelsContainer({ searchParams }: Props) {
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold ">{t`Model Management`}</h1>
          <p className="text-muted-foreground">
            {t`Manage your connections to large language models`}
          </p>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <Suspense fallback={<SearchInputFallback className="flex-1" />}>
            <SearchInput name="q" className="flex-1" />
          </Suspense>
          <CreateModelDialogTrigger
            className="flex items-center gap-2"
            render={<Button />}
          >
            <Plus />
            {t`New model`}
          </CreateModelDialogTrigger>
        </div>

        {/* Models Grid */}
        <Suspense
          fallback={
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          }
        >
          <ModelListsContainer searchParams={searchParams} />
        </Suspense>
        <CreateModelDialog />
        <EditModelDialog />
        <DeleteModelAlertDialog />
        <DetailsModelDialog />
      </div>
    </div>
  );
}
