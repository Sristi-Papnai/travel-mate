import JoinCommunityForm from "./join-community-form";

export default function JoinCommunity() {
  return (
    <section className="bg-white py-12 px-10 text-start">
      <h2 className="text-3xl font-bold mb-2 text-black">Join Our Travel Community</h2>
      <p className="text-gray-600 mb-6">
        Sign up for exclusive travel tips, updates, and special offers tailored just for you!
      </p>
      <div className="flex justify-start">
        <JoinCommunityForm />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        By clicking Join Now, you agree to our <span className="underline">Terms and Conditions</span>.
      </p>
    </section>
  );
}
