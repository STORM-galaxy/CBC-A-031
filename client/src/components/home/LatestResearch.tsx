import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  category: string;
  source: string;
  publishedAt: string;
}

const ArticleCard = ({ article }: { article: Article }) => {
  const categoryColors: Record<string, string> = {
    "New Research": "green",
    "Technology": "blue",
    "Clinical Study": "yellow"
  };

  const color = categoryColors[article.category] || "gray";

  return (
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <img 
        src={article.imageUrl} 
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <Badge 
            variant="secondary"
            className={`bg-${color}-100 text-${color}-800 text-xs font-medium px-2.5 py-0.5 rounded-full`}
          >
            {article.category}
          </Badge>
          <span className="text-gray-500 text-sm ml-2">
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h3>
        <p className="text-gray-600 mb-4">{article.summary}</p>
        <Link href={`/medical-news/${article.id}`}>
          <a className="text-primary hover:text-primary/90 font-medium">
            Read full article &rarr;
          </a>
        </Link>
      </CardContent>
    </Card>
  );
};

const LatestResearch = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['/api/news'],
    staleTime: 60000 // 1 minute
  });

  // Fallback data when API data is not available
  const fallbackArticles = [
    {
      id: 1,
      title: "Breakthrough in Alzheimer's Treatment Shows Promise in Clinical Trials",
      summary: "Researchers report significant cognitive improvements in early-stage patients using a novel targeted therapy approach.",
      imageUrl: "https://images.unsplash.com/photo-1581093450021-a7a0e6e7e35f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      category: "New Research",
      source: "Journal of Neurology",
      publishedAt: "2023-05-15T00:00:00.000Z",
      content: ""
    },
    {
      id: 2,
      title: "AI-Powered Diagnostic Tool Achieves 94% Accuracy in Cancer Detection",
      summary: "New machine learning algorithm shows exceptional performance in identifying early-stage tumors from medical imaging.",
      imageUrl: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      category: "Technology",
      source: "Digital Medicine Today",
      publishedAt: "2023-05-10T00:00:00.000Z",
      content: ""
    },
    {
      id: 3,
      title: "Large-Scale Study Identifies New Genetic Markers for Heart Disease Risk",
      summary: "International research consortium discovers multiple genetic variants associated with increased cardiovascular risk.",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      category: "Clinical Study",
      source: "Cardiology Research",
      publishedAt: "2023-05-05T00:00:00.000Z",
      content: ""
    }
  ];

  const displayArticles = articles || fallbackArticles;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Latest Medical Research</h2>
        <Link href="/medical-news">
          <a className="text-primary hover:text-primary/90 text-sm font-medium">View all news</a>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
};

export default LatestResearch;
