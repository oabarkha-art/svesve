import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Malerei from "./pages/Malerei";
import Illustration from "./pages/Illustration";
import Contact from "./pages/Contact";
import Prints from "./pages/Prints";
import Checkout from "./pages/Checkout";
import { CartProvider } from "./contexts/CartContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/malerei" component={Malerei} />
      <Route path="/illustration" component={Illustration} />
      <Route path="/prints" component={Prints} />
      <Route path="/kasse" component={Checkout} />
      <Route path="/kontakt" component={Contact} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Sonner />
          <CartProvider>
            <Router />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
