import DiscoverCard from "./discover-card";

const cardData = [
  {
    title: "Medium length section heading goes here",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  },
  {
    title: "Medium length section heading goes here",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  },
  {
    title: "Medium length section heading goes here",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  },
];

export default function DiscoverCards() {
  return (
    <section className="w-full px-8 py-12 grid gap-8 md:grid-cols-3">
      {cardData.map((card, index) => (
        <DiscoverCard key={index} title={card.title} description={card.description} />
      ))}
    </section>
  );
}
