import { logout } from "@/lib/actions";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-xs text-neutral-500 hover:underline dark:text-neutral-400"
      >
        Sign out
      </button>
    </form>
  );
}
