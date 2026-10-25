type PagePlaceholderProps = {
  title: string
  description: string
}

export const PagePlaceholder = ({ title, description }: PagePlaceholderProps) => {
  return (
    <section className="max-w-[720px]">
      <h1 className="text-foreground m-0 text-[clamp(30px,4vw,42px)] font-bold tracking-[-0.035em]">
        {title}
      </h1>
      <p className="text-muted-foreground mt-3 mb-0 max-w-[560px] text-base leading-relaxed">
        {description}
      </p>
    </section>
  )
}
