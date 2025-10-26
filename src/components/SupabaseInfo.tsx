import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle } from 'lucide-react';

export function SupabaseInfo() {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [projectRef, setProjectRef] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL || '';
    setSupabaseUrl(url);
    
    // Extract project reference from URL
    const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
    if (match) {
      setProjectRef(match[1]);
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!supabaseUrl) {
    return (
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <p className="text-sm text-yellow-800">
          Supabase URL not found. Please check your environment variables.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold text-sm">Supabase Configuration</h3>
      
      <div className="space-y-2">
        <div>
          <label className="text-xs text-muted-foreground">Project Reference:</label>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-muted px-2 py-1 rounded">{projectRef}</code>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(projectRef)}
            >
              {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>
        
        <div>
          <label className="text-xs text-muted-foreground">OAuth Callback URL:</label>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-muted px-2 py-1 rounded break-all">
              {`${supabaseUrl}/auth/v1/callback`}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(`${supabaseUrl}/auth/v1/callback`)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Use these values when configuring Google OAuth in the Google Cloud Console.
      </p>
    </Card>
  );
}
