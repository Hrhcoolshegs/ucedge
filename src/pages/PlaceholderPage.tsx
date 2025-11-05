interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-accent">{title}</h1>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>
      <div className="bg-white rounded-lg shadow-sm border-t-[3px] border-primary p-12 text-center">
        <p className="text-lg text-muted-foreground">
          This page is under construction and will be available soon.
        </p>
      </div>
    </div>
  );
};
