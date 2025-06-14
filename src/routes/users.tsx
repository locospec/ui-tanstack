import ComponentCard from "@/components/component-card";
import ComponentLoader from "@/components/component-loader-server";
import { Button } from "@/components/ui/button";
import registry from "@/registry.json";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import type { RegistryItem } from "shadcn/registry";
import type { User } from "../utils/users";
const allComponents = registry.items as unknown as RegistryItem[];

export const Route = createFileRoute("/users")({
  loader: async () => {
    const res = await fetch("/api/users");

    if (!res.ok) {
      throw new Error("Unexpected status code");
    }

    const data = (await res.json()) as Array<User>;

    return data;
  },
  component: UsersComponent,
});

export const getComponentsByNames = (names: string[]): RegistryItem[] => {
  const componentsMap = new Map(allComponents.map(comp => [comp.name, comp]));

  return names
    .map(name => componentsMap.get(name))
    .filter((comp): comp is RegistryItem => comp !== undefined);
};

function UsersComponent() {
  const users = Route.useLoaderData();

  const components = getComponentsByNames(allComponents.map(item => item.name));

  console.log("registry", components);

  return (
    <div className="flex gap-2 bg-red-200 p-2">
      <Button>Button</Button>

      {components.map(component => (
        <ComponentCard
          key={component.name}
          component={component}
          className="data-[slot=comp-542]:px-0"
        >
          <ComponentLoader component={component} />
          {/* <ComponentDetails component={component} /> */}
        </ComponentCard>
      ))}

      <ul className="list-disc pl-4">
        {[
          ...users,
          { id: "i-do-not-exist", name: "Non-existent User", email: "" },
        ].map(user => {
          return (
            <li key={user.id} className="whitespace-nowrap">
              <Link
                to="/users/$userId"
                params={{
                  userId: String(user.id),
                }}
                className="block py-1 text-blue-800 hover:text-blue-600"
                activeProps={{ className: "text-black font-bold" }}
              >
                <div>{user.name}</div>
              </Link>
            </li>
          );
        })}
      </ul>
      <hr />
      <Outlet />
    </div>
  );
}
