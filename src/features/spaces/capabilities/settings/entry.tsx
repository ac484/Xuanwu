"use client";

import { useState, useEffect } from "react";
import { useWorkspace } from "@/features/workspaces";
import { Card, CardDescription, CardHeader, CardTitle, CardFooter, CardContent } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { 
  Box, 
  Settings2,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "@/hooks/ui/use-toast";
import { useRouter } from "next/navigation";
import { WorkspaceLifecycleState, Address } from "@/types/domain";
import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";
import { Switch } from "@/app/_components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { Textarea } from "@/app/_components/ui/textarea";

function WorkspaceSettingsForm() {
    const { state, dispatch } = useWorkspace();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const [name, setName] = useState("");
    const [visibility, setVisibility] = useState<'visible' | 'hidden'>("hidden");
    const [lifecycleState, setLifecycleState] = useState<WorkspaceLifecycleState>("preparatory");
    const [address, setAddress] = useState<Address>({ street: "", city: "", state: "", postalCode: "", country: "" });
  
    useEffect(() => {
      if (state.workspace) {
        setName(state.workspace.name);
        setVisibility(state.workspace.visibility);
        setLifecycleState(state.workspace.lifecycleState);
        setAddress(state.workspace.address || { street: "", city: "", state: "", postalCode: "", country: "" });
      }
    }, [state.workspace]);
  
    const handleAddressChange = (field: keyof Address, value: string) => {
      setAddress(prev => ({ ...prev, [field]: value }));
    };
  
    const onUpdateSettings = async () => {
      setLoading(true);
      try {
        dispatch({ type: 'UPDATE_SETTINGS', payload: { name, visibility, lifecycleState, address } });
        toast({ title: "Space settings synchronized" });
      } catch (error: unknown) {
        toast({ variant: "destructive", title: "Failed to update settings" });
      }
      setLoading(false);
    };

    const onDelete = async () => {
        if (confirm(`This action will permanently erase the workspace node \"${state.workspace?.name}\". Are you sure?`)) {
            try {
                dispatch({ type: 'DELETE_WORKSPACE' });
                toast({ title: "Workspace node destroyed" });
                router.push('/workspaces');
            } catch (error: unknown) {
                 toast({ variant: "destructive", title: "Failed to destroy workspace" });
            }
        }
    }
  
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-primary" />
                        General Settings
                    </CardTitle>
                    <CardDescription>Manage this workspace's core attributes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest opacity-60">
                            Workspace Node Name
                        </Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="rounded-xl h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest opacity-60">
                            Current Lifecycle State
                        </Label>
                        <Select
                            value={lifecycleState}
                            onValueChange={(v: WorkspaceLifecycleState) =>
                            setLifecycleState(v)
                            }
                        >
                            <SelectTrigger className="rounded-xl h-11">
                            <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="preparatory">Preparatory</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="stopped">Stopped</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest opacity-60">
                            Location
                        </Label>
                         <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Country" value={address?.country || ''} onChange={(e) => handleAddressChange('country', e.target.value)} className="rounded-xl h-11" />
                            <Input placeholder="State/Province" value={address?.state || ''} onChange={(e) => handleAddressChange('state', e.target.value)} className="rounded-xl h-11" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="City" value={address?.city || ''} onChange={(e) => handleAddressChange('city', e.target.value)} className="rounded-xl h-11" />
                            <Input placeholder="Postal Code" value={address?.postalCode || ''} onChange={(e) => handleAddressChange('postalCode', e.target.value)} className="rounded-xl h-11" />
                        </div>
                        <Input placeholder="Street Address" value={address?.street || ''} onChange={(e) => handleAddressChange('street', e.target.value)} className="rounded-xl h-11" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/60">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-bold flex items-center gap-2">
                                {visibility === 'visible' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                Workspace Visibility
                            </Label>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                            {visibility === "visible"
                                ? "Publicly visible in dimension directory"
                                : "Hidden, visible only to authorized personnel"}
                            </p>
                        </div>
                        <Switch
                            checked={visibility === "visible"}
                            onCheckedChange={(checked) =>
                            setVisibility(checked ? "visible" : "hidden")
                            }
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={onUpdateSettings} disabled={loading} className="ml-auto">
                        {loading ? 'Saving...' : 'Save General Settings'}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Box className="w-5 h-5 text-destructive" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible actions related to this workspace.</CardDescription>
                </CardHeader>
                <CardFooter className="border-t pt-6">
                     <Button variant="destructive" onClick={onDelete}>Destroy Workspace Node</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

/**
 * WorkspaceSettings - Manages settings for the workspace.
 */
export default function WorkspaceSettings() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <WorkspaceSettingsForm />
    </div>
  );
}
