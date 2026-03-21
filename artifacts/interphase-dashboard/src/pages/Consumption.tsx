import { useState } from "react";
import { useAppState } from "@/hooks/use-app-state";
import { useListConsumption, useCreateConsumptionEntry, useUpdateConsumptionEntry } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Plus, Calendar as CalendarIcon, Save, X } from "lucide-react";
import { Link } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function Consumption() {
  const { selectedProjectId, selectedWeekNumber, setSelectedWeekNumber } = useAppState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  
  const { data: consumption = [], isLoading } = useListConsumption(
    { projectId: selectedProjectId!, weekNumber: selectedWeekNumber },
    { query: { enabled: !!selectedProjectId } }
  );
  
  const safeConsumption = Array.isArray(consumption) ? consumption : [];

  const createMutation = useCreateConsumptionEntry({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/consumption"] });
        setEditingId(null);
        toast({ title: "Saved", description: "Consumption logged." });
      }
    }
  });

  const updateMutation = useUpdateConsumptionEntry({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/consumption"] });
        setEditingId(null);
        toast({ title: "Updated", description: "Entry updated." });
      }
    }
  });

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  if (!selectedProjectId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-bold">No Project Selected</h2>
        <p className="text-muted-foreground text-center">Select a project to track weekly material and labour consumption.</p>
      </div>
    );
  }

  const startNew = () => {
    // Generate mock week dates based on week number
    const today = new Date();
    const mockStart = new Date(today.getFullYear(), 0, 1 + (selectedWeekNumber - 1) * 7).toISOString().split('T')[0];
    const mockEnd = new Date(today.getFullYear(), 0, 7 + (selectedWeekNumber - 1) * 7).toISOString().split('T')[0];

    setEditingId('new');
    setEditForm({
      projectId: selectedProjectId,
      weekNumber: selectedWeekNumber,
      weekStart: mockStart,
      weekEnd: mockEnd,
      itemName: "",
      estimatedQty: 0,
      actualQty: 0,
      unitCost: 0,
      notes: ""
    });
  };

  const saveEdit = () => {
    if (!editForm.itemName) {
      toast({ variant: "destructive", title: "Error", description: "Item Name required." });
      return;
    }
    
    const payload = {
      ...editForm,
      estimatedQty: Number(editForm.estimatedQty),
      actualQty: Number(editForm.actualQty),
      unitCost: Number(editForm.unitCost)
    };

    if (editingId === 'new') {
      createMutation.mutate({ data: payload });
    } else {
      updateMutation.mutate({ id: editingId as number, data: payload });
    }
  };

  // Generate week options (1-52)
  const weeks = Array.from({length: 52}, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weekly Consumption</h1>
          <p className="text-muted-foreground mt-1">Log and track actual usage vs estimates.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-card border border-border/50 rounded-md px-3 py-1 shadow-sm">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <Select 
              value={selectedWeekNumber.toString()} 
              onValueChange={(v) => setSelectedWeekNumber(parseInt(v))}
            >
              <SelectTrigger className="h-8 border-none shadow-none focus:ring-0 w-32 font-medium">
                <SelectValue placeholder="Week" />
              </SelectTrigger>
              <SelectContent>
                {weeks.map(w => (
                  <SelectItem key={w} value={w.toString()}>Week {w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={startNew} disabled={editingId !== null} className="gap-2 shadow-sm shadow-primary/20">
            <Plus className="w-4 h-4" /> Log Entry
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-lg shadow-sm shadow-black/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow className="border-border/50">
              <TableHead className="w-[200px]">Item</TableHead>
              <TableHead className="text-right w-[100px]">Est. Qty</TableHead>
              <TableHead className="text-right w-[100px]">Act. Qty</TableHead>
              <TableHead className="text-right w-[100px]">Var Qty</TableHead>
              <TableHead className="text-right w-[100px]">Var %</TableHead>
              <TableHead className="text-right w-[120px]">Unit Cost (₹)</TableHead>
              <TableHead className="text-right w-[140px] font-bold text-foreground bg-secondary/50">Act. Cost (₹)</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeConsumption.length === 0 && editingId !== 'new' && !isLoading && (
               <TableRow><TableCell colSpan={9} className="h-24 text-center text-muted-foreground">No entries for this week.</TableCell></TableRow>
            )}
            
            {editingId === 'new' && (
              <TableRow className="border-border/50 h-14 bg-primary/5">
                <TableCell><Input autoFocus placeholder="Item Name" className="h-9" value={editForm.itemName} onChange={e => setEditForm({...editForm, itemName: e.target.value})} /></TableCell>
                <TableCell><Input type="number" placeholder="Est" className="h-9 text-right" value={editForm.estimatedQty} onChange={e => setEditForm({...editForm, estimatedQty: e.target.value})} /></TableCell>
                <TableCell><Input type="number" placeholder="Act" className="h-9 text-right font-medium" value={editForm.actualQty} onChange={e => setEditForm({...editForm, actualQty: e.target.value})} /></TableCell>
                <TableCell className="text-right text-muted-foreground">-</TableCell>
                <TableCell className="text-right text-muted-foreground">-</TableCell>
                <TableCell><Input type="number" placeholder="Rate" className="h-9 text-right" value={editForm.unitCost} onChange={e => setEditForm({...editForm, unitCost: e.target.value})} /></TableCell>
                <TableCell className="text-right font-bold text-primary">
                  {formatCurrency((Number(editForm.actualQty) || 0) * (Number(editForm.unitCost) || 0))}
                </TableCell>
                <TableCell><Input placeholder="Site remarks..." className="h-9" value={editForm.notes} onChange={e => setEditForm({...editForm, notes: e.target.value})} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:bg-emerald-500/10" onClick={saveEdit}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-secondary" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {safeConsumption.map((row) => {
              const isOver = row.variancePercent > 10;
              const isUnder = row.variancePercent < -10;
              
              return (
                <TableRow key={row.id} className="border-border/50 hover:bg-secondary/30 h-14">
                  <TableCell className="font-medium">{row.itemName}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{row.estimatedQty}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{row.actualQty}</TableCell>
                  <TableCell className={cn("text-right tabular-nums font-medium", row.variance > 0 ? "text-destructive" : row.variance < 0 ? "text-emerald-600" : "")}>
                    {row.variance > 0 ? '+' : ''}{row.variance}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-semibold tabular-nums",
                      isOver ? "bg-destructive/10 text-destructive" : isUnder ? "bg-emerald-500/10 text-emerald-600" : "bg-secondary text-secondary-foreground"
                    )}>
                      {row.variancePercent > 0 ? '+' : ''}{row.variancePercent}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{row.unitCost.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right tabular-nums font-bold bg-secondary/20">
                    {formatCurrency(row.actualCost)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">{row.notes || '-'}</TableCell>
                  <TableCell className="text-right">
                     {/* Edit existing disabled for brevity, focus is on adding new week entries */}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
