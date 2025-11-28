import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Card className="bg-slate-800/30 backdrop-blur-sm border border-red-600/30 rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            Something went wrong
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-slate-300">
                            {this.props.fallbackMessage || "An unexpected error occurred while processing your request."}
                        </p>
                        <Button 
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;