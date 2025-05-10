import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, BarChart, FlaskRound, FileText, Heart, Brain, Microscope } from "lucide-react";

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

const MedicalNews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const pageSize = 9;

  // Fetch news articles
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/news', currentPage, pageSize, selectedCategory],
    keepPreviousData: true,
  });

  // Fetch categories
  const { data: categoriesData } = useQuery<{category: string, count: number}[]>({
    queryKey: ['/api/news/categories'],
    staleTime: Infinity,
  });

  // Fallback data when API data is not available
  const fallbackArticles: Article[] = [
    {
      id: 1,
      title: "Breakthrough in Alzheimer's Treatment Shows Promise in Clinical Trials",
      summary: "Researchers report significant cognitive improvements in early-stage patients using a novel targeted therapy approach.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
      imageUrl: "https://images.unsplash.com/photo-1581093450021-a7a0e6e7e35f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      category: "Neurology",
      source: "Journal of Neurology",
      publishedAt: "2023-05-15T00:00:00.000Z"
    },
    {
      id: 2,
      title: "AI-Powered Diagnostic Tool Achieves 94% Accuracy in Cancer Detection",
      summary: "New machine learning algorithm shows exceptional performance in identifying early-stage tumors from medical imaging.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
      imageUrl: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      category: "Technology",
      source: "Digital Medicine Today",
      publishedAt: "2023-05-10T00:00:00.000Z"
    },
    {
      id: 3,
      title: "Large-Scale Study Identifies New Genetic Markers for Heart Disease Risk",
      summary: "International research consortium discovers multiple genetic variants associated with increased cardiovascular risk.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      category: "Cardiology",
      source: "Cardiology Research",
      publishedAt: "2023-05-05T00:00:00.000Z"
    },
    {
      id: 4,
      title: "New Vaccine Technology Offers Hope for Preventing Future Pandemics",
      summary: "Scientists develop a versatile platform for rapid vaccine creation that could dramatically reduce response time to novel pathogens.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
      imageUrl: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      category: "Immunology",
      source: "Vaccine Research Journal",
      publishedAt: "2023-04-28T00:00:00.000Z"
    },
    {
      id: 5,
      title: "Innovative Non-Invasive Treatment for Chronic Pain Shows Promising Results",
      summary: "Clinical trials demonstrate significant pain reduction in patients with long-term conditions using targeted ultrasound therapy.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
      imageUrl: "https://images.unsplash.com/photo-1631815588090-d1bcbe9b4c25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      category: "Pain Management",
      source: "Journal of Pain Medicine",
      publishedAt: "2023-04-20T00:00:00.000Z"
    },
    {
      id: 6,
      title: "Gut Microbiome Linked to Mental Health in Groundbreaking Research",
      summary: "Scientists establish clear connections between gut bacteria composition and several psychiatric conditions in large-scale study.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      category: "Mental Health",
      source: "Microbiome Research",
      publishedAt: "2023-04-15T00:00:00.000Z"
    }
  ];

  const fallbackCategories = [
    { category: "All", count: 23 },
    { category: "Cardiology", count: 5 },
    { category: "Neurology", count: 4 },
    { category: "Immunology", count: 3 },
    { category: "Technology", count: 6 },
    { category: "Mental Health", count: 2 },
    { category: "Pain Management", count: 3 }
  ];

  const displayArticles = articles || fallbackArticles;
  const categories = categoriesData || fallbackCategories;

  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'cardiology': return <Heart className="h-4 w-4" />;
      case 'neurology': return <Brain className="h-4 w-4" />;
      case 'technology': return <BarChart className="h-4 w-4" />;
      case 'research': return <FlaskRound className="h-4 w-4" />;
      case 'immunology': return <Microscope className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredArticles = selectedCategory && selectedCategory !== "All"
    ? displayArticles.filter(article => article.category === selectedCategory)
    : displayArticles;

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / pageSize);
  const currentArticles = filteredArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Latest Medical News</h1>
      <p className="text-gray-600 mb-8">
        Stay updated with the latest advancements, research findings, and breakthroughs in medicine and healthcare.
      </p>

      {/* Category filter */}
      <Tabs 
        defaultValue="All" 
        className="mb-8" 
        onValueChange={(value) => {
          setSelectedCategory(value);
          setCurrentPage(1);
        }}
      >
        <TabsList className="flex flex-wrap h-auto mb-2">
          {categories.map((cat) => (
            <TabsTrigger key={cat.category} value={cat.category} className="mb-1">
              <div className="flex items-center">
                {getCategoryIcon(cat.category)}
                <span className="ml-1">{cat.category}</span>
                {cat.count > 0 && (
                  <span className="ml-1 text-xs bg-gray-100 text-gray-600 rounded-full px-2">
                    {cat.count}
                  </span>
                )}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Articles grid - same for all tabs */}
        {categories.map((cat) => (
          <TabsContent key={cat.category} value={cat.category} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full rounded-t-lg" />
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2 mt-1" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full mt-2" />
                      <Skeleton className="h-4 w-2/3 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {currentArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentArticles.map((article) => (
                      <Card key={article.id} className="overflow-hidden">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={article.imageUrl} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getCategoryIcon(article.category)}
                              {article.category}
                            </Badge>
                            <span className="text-gray-500 text-xs flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(article.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                          <CardDescription className="text-xs text-gray-500 mt-1">
                            Source: {article.source}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {article.summary}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Link href={`/medical-news/${article.id}`}>
                            <a className="text-primary hover:text-primary/90 text-sm font-medium">
                              Read full article &rarr;
                            </a>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No articles found in this category.</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav aria-label="Page navigation">
                      <ul className="inline-flex items-center -space-x-px">
                        <li>
                          <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                          >
                            <span className="sr-only">Previous</span>
                            &laquo;
                          </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <li key={page}>
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 leading-tight border border-gray-300 ${
                                page === currentPage
                                  ? "text-primary bg-primary-50 border-primary"
                                  : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                              }`}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        <li>
                          <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                          >
                            <span className="sr-only">Next</span>
                            &raquo;
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MedicalNews;
