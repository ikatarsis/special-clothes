type PagePlaceholderProps = {
  title: string
  description: string
}

export const PagePlaceholder = ({ title, description }: PagePlaceholderProps) => {
  return (
    <section className="max-w-[720px]">
      <h1 className="m-0 text-[clamp(30px,4vw,42px)] font-bold tracking-[-0.035em] text-gray-900">{title}</h1>
      <p className="mt-3 mb-0 max-w-[560px] text-base leading-relaxed text-gray-500">{description}</p>
    </section>
  )
}
