import { Link } from "react-router-dom";

interface FeatureCardProps {
  title: string;
  image: string;
  link?: string;
  onClick?: () => void;
}

const FeatureCard = ({ title, image, link, onClick }: FeatureCardProps) => {
  const cardContent = (
    <div className="group relative overflow-hidden rounded-lg border-2 border-primary/50 bg-dark-card hover:border-primary transition-all duration-300 hover:border-glow-strong cursor-pointer animate-fade-in">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 bg-gradient-to-t from-dark via-dark-card/95 to-transparent absolute bottom-0 left-0 right-0 flex items-center justify-center">
        <h3 className="text-2xl md:text-3xl font-title font-bold text-primary text-glow">
          {title}
        </h3>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );

  if (link) {
    return <Link to={link}>{cardContent}</Link>;
  }

  return <div onClick={onClick}>{cardContent}</div>;
};

export default FeatureCard;
