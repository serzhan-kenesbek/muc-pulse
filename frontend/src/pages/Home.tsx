import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MapPin, BarChart3, QrCode } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="MUCPulse Logo" className="h-10 w-auto" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  MUCPulse
                </h1>
                <p className="text-xs text-muted-foreground">Citizen Platform</p>
              </div>
            </Link>
            {/* Removed the Analytics button from the navbar */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-3">
              Welcome to{" "}
              <img src="/logo.svg" alt="MUCPulse Logo" className="h-10 md:h-12 w-auto" />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                MUCPulse
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A citizen-driven platform for sharing and visualizing city signals across Munich.
              Help us understand urban experiences through real-time feedback.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3">
              <QrCode className="h-10 w-10 text-primary" />
              <h3 className="text-lg font-semibold">Scan & Report</h3>
              <p className="text-sm text-muted-foreground">
                Find QR codes around Munich to quickly submit signals about your location.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <MapPin className="h-10 w-10 text-primary" />
              <h3 className="text-lg font-semibold">Location-Based</h3>
              <p className="text-sm text-muted-foreground">
                Share feedback about specific areas and see what others are experiencing.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <BarChart3 className="h-10 w-10 text-primary" />
              <h3 className="text-lg font-semibold">Real-Time Analytics</h3>
              <p className="text-sm text-muted-foreground">
                View live heatmaps and statistics about city signals across Munich.
              </p>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">Ready to Share Your Experience?</h3>
              <p className="text-muted-foreground">
                Scan a QR code or start reporting directly
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 justify-center">
              <Link to="/report/location" className="h-full">
                <Card className="p-6 space-y-3 h-full flex flex-col items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer">
                  <MapPin className="h-10 w-10 text-white" />
                  <span className="text-lg font-semibold">Submit a Signal</span>
                </Card>
              </Link>
              <Link to="/analytics" className="h-full">
                <Card className="p-6 space-y-3 h-full flex flex-col items-center justify-center border bg-card shadow-sm hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
                  <BarChart3 className="h-10 w-10 text-primary" />
                  <span className="text-lg font-semibold">Heatmap / Analytics</span>
                </Card>
              </Link>
            </div>
          </div>

          {/* Stats Preview */}
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">1.2K+</p>
                <p className="text-sm text-muted-foreground">Signals Shared</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">250+</p>
                <p className="text-sm text-muted-foreground">Locations</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">100+</p>
                <p className="text-sm text-muted-foreground">QR Codes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">Live</p>
                <p className="text-sm text-muted-foreground">Real-Time Data</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;
