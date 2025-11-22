import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, CheckCircle, BarChart3 } from "lucide-react";

const ReportSuccess = () => {
  useEffect(() => {
    // Clear session storage after successful submission
    return () => {
      sessionStorage.removeItem("reportLocation");
      sessionStorage.removeItem("reportSignal");
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            <Link to="/">
              <div>
                <img src="/logo.svg" alt="MUCPulse Logo" className="h-10 w-auto" />
                <p className="text-xs text-muted-foreground">Signal Submitted</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
          </div>

          {/* Thank You Message */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              THANK YOU
            </h2>
            <p className="text-muted-foreground">
              Your signal has been successfully submitted and will help improve our city!
            </p>
          </div>

          {/* Divider */}
          <div className="border-t pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Want to see how your signal contributes to the bigger picture?
            </p>
            
            {/* See Our Project Button */}
            <Link to="/analytics">
              <Button size="lg" className="w-full gap-2">
                <BarChart3 className="h-5 w-5" />
                See our Project
              </Button>
            </Link>
          </div>

          {/* Secondary Actions */}
          <div className="space-y-2 pt-4 border-t">
            <Link to="/report/location">
              <Button variant="outline" size="sm" className="w-full">
                Submit Another Signal
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ReportSuccess;
