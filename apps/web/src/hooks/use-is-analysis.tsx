"use client";

import { useParams, usePathname } from "next/navigation";
import React, {
  createContext,
  Suspense,
  use,
  useEffect,
  useState,
} from "react";
import type { ParamsOf } from "../../.next/dev/types/routes";

const Context = createContext<string | undefined>(undefined);
const RegisterContext = createContext<(value: string | undefined) => void>(
  () => {}
);

export default function IsAnalysisProvider({
  children,
}: React.PropsWithChildren) {
  const [value, setValue] = useState<string | undefined>();
  return (
    <Context value={value}>
      <RegisterContext value={setValue}>
        <Suspense>
          <IsAnalysisRegister />
        </Suspense>
      </RegisterContext>
      {children}
    </Context>
  );
}

function IsAnalysisRegister() {
  const setValue = use(RegisterContext);
  const pathname = usePathname();
  const { id } = useParams<ParamsOf<"/[locale]/analysis/[id]">>();
  const value = pathname.match(/^\/..\/analysis\/.+/) ? id : undefined;

  useEffect(() => {
    setValue(value);
  }, [value]);
  return null;
}

export const useIsAnalysis = () => use(Context);
