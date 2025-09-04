'use client';
import * as Dialog from '@radix-ui/react-dialog';

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
};

export default function SignupModal({ open, setOpen }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-96 max-w-full -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-xl font-bold mb-4">Sign Up</Dialog.Title>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border px-3 py-2 rounded"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Sign Up
            </button>
          </form>

          <Dialog.Close className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer">
            ✕
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
