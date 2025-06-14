"use client";

import { ComponentType, useEffect, useState } from "react";
import type { RegistryItem } from "shadcn/registry";

interface ComponentLoaderProps {
  component: RegistryItem;
}

export default function ComponentLoader<TProps extends object>({
  component,
  ...props
}: ComponentLoaderProps & TProps) {
  const [Component, setComponent] = useState<ComponentType<TProps> | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!component?.name) return;

    const loadComponent = async () => {
      try {
        const LoadedComponent = (
          await import(`@/components/locospecui/${component.name}`)
        ).default as ComponentType<TProps>;
        setComponent(() => LoadedComponent);
      } catch (err) {
        console.error(`Failed to load component ${component.name}:`, err);
        setError(
          err instanceof Error ? err : new Error("Failed to load component")
        );
      }
    };

    loadComponent();
  }, [component?.name]);

  if (!component?.name) return null;
  if (error) return <div>Error loading component: {error.message}</div>;
  if (!Component) return <div>Loading {component.name}...</div>;

  return <Component {...(props as TProps)} currentPage={1} totalPages={10} />;
}
