import { useState } from 'react';
import { BookOpen, Search, Plus, FolderOpen, FileText, Edit, Trash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Getting Started', articles: 12450, icon: '🚀' },
    { name: 'Account Management', articles: 8320, icon: '👤' },
    { name: 'Billing & Payments', articles: 15780, icon: '💳' },
    { name: 'Technical Support', articles: 24650, icon: '🔧' },
    { name: 'Features & Updates', articles: 18940, icon: '✨' }
  ];

  const articles = [
    {
      id: '1',
      title: 'How to create your first campaign',
      category: 'Getting Started',
      views: 124500,
      lastUpdated: '2024-01-10',
      status: 'published'
    },
    {
      id: '2',
      title: 'Understanding customer lifecycle stages',
      category: 'Getting Started',
      views: 89200,
      lastUpdated: '2024-01-12',
      status: 'published'
    },
    {
      id: '3',
      title: 'Setting up payment methods',
      category: 'Billing & Payments',
      views: 65400,
      lastUpdated: '2024-01-08',
      status: 'published'
    },
    {
      id: '4',
      title: 'Troubleshooting login issues',
      category: 'Technical Support',
      views: 43200,
      lastUpdated: '2024-01-14',
      status: 'published'
    },
    {
      id: '5',
      title: 'New AI features guide',
      category: 'Features & Updates',
      views: 187600,
      lastUpdated: '2024-01-15',
      status: 'draft'
    }
  ];

  const filteredArticles = articles.filter(a =>
    searchQuery === '' ||
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">Manage help articles and documentation</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Articles</p>
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{articles.length}</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Categories</p>
            <FolderOpen className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{categories.length}</h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Views</p>
            <BookOpen className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {articles.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
          </h3>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Published</p>
            <FileText className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {articles.filter(a => a.status === 'published').length}
          </h3>
        </Card>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Card key={cat.name} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <h3 className="font-semibold text-foreground mb-1">{cat.name}</h3>
              <p className="text-sm text-muted-foreground">{cat.articles} articles</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Articles */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Articles</h2>
        <div className="space-y-2">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{article.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground ml-8">
                    <Badge variant="outline">{article.category}</Badge>
                    <span>{article.views} views</span>
                    <span>Updated: {article.lastUpdated}</span>
                    <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                      {article.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};