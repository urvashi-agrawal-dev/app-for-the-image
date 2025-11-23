import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Wand2, Image as ImageIcon, Download } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">AI Image Studio</span>
          </div>
          <Button
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-login"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center space-y-6">
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Powered by Advanced AI
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Create Stunning Images
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              With AI Magic
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into beautiful images using cutting-edge AI models like DALL-E. 
            Generate, download, and share amazing artwork in seconds.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
              data-testid="button-hero-cta"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Start Creating Free
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover-elevate">
            <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-950 flex items-center justify-center mb-4">
              <Wand2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multiple AI Models</h3>
            <p className="text-muted-foreground">
              Choose from DALL-E 3, DALL-E 2, and more powerful AI models for your creative needs.
            </p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="w-12 h-12 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-950 flex items-center justify-center mb-4">
              <ImageIcon className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">High-Quality Results</h3>
            <p className="text-muted-foreground">
              Generate stunning, high-resolution images up to 1792x1024 with HD quality options.
            </p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Download & Share</h3>
            <p className="text-muted-foreground">
              Download your creations instantly and share them with attribution to support the platform.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-sm text-muted-foreground">
            Platform created with by a passionate developer. Powered by OpenAI's DALL-E.
          </p>
        </div>
      </footer>
    </div>
  );
}
