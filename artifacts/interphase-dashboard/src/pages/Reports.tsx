import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, FileText, Printer, SlidersHorizontal } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("project-summary");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Exports</h1>
          <p className="text-muted-foreground mt-1">Generate standardized tabular reports for offline review.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="shadow-sm gap-2">
            <Printer className="w-4 h-4" /> Print
          </Button>
          <Button className="shadow-sm shadow-primary/20 gap-2">
            <FileDown className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-card border border-border/50 rounded-lg p-1.5 shadow-sm inline-flex mb-6 w-full sm:w-auto">
          <TabsList className="bg-transparent h-auto p-0 gap-1 w-full justify-start overflow-x-auto">
            <TabsTrigger value="project-summary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md px-4 py-2">
              Project Summary
            </TabsTrigger>
            <TabsTrigger value="consumption" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md px-4 py-2">
              Consumption Ledger
            </TabsTrigger>
            <TabsTrigger value="variance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md px-4 py-2">
              Item Variance
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" className="h-8 gap-2 border-dashed">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters applied (0)
          </Button>
          <p className="text-sm text-muted-foreground ml-2">Showing all records for Q1 2024</p>
        </div>

        <TabsContent value="project-summary" className="mt-0 outline-none">
          <Card className="border-border/50 shadow-sm shadow-black/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Project Code / Name</th>
                    <th className="px-6 py-4 font-semibold">Client</th>
                    <th className="px-6 py-4 font-semibold text-right">PO Value (₹)</th>
                    <th className="px-6 py-4 font-semibold text-right">Billed YTD (₹)</th>
                    <th className="px-6 py-4 font-semibold text-right">Cost YTD (₹)</th>
                    <th className="px-6 py-4 font-semibold text-right">Margin %</th>
                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr className="hover:bg-secondary/20 bg-card">
                    <td className="px-6 py-4 font-medium">PRJ-001 <br/><span className="font-normal text-muted-foreground">Tech Park Phase 1</span></td>
                    <td className="px-6 py-4">Acme Corp</td>
                    <td className="px-6 py-4 text-right tabular-nums">1,20,00,000</td>
                    <td className="px-6 py-4 text-right tabular-nums">45,00,000</td>
                    <td className="px-6 py-4 text-right tabular-nums">38,50,000</td>
                    <td className="px-6 py-4 text-right tabular-nums text-emerald-600 font-medium">14.4%</td>
                    <td className="px-6 py-4 text-center"><span className="bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded text-xs font-semibold">ACTIVE</span></td>
                  </tr>
                  <tr className="hover:bg-secondary/20 bg-card">
                    <td className="px-6 py-4 font-medium">PRJ-002 <br/><span className="font-normal text-muted-foreground">City Mall Hub</span></td>
                    <td className="px-6 py-4">City Group</td>
                    <td className="px-6 py-4 text-right tabular-nums">85,00,000</td>
                    <td className="px-6 py-4 text-right tabular-nums">12,00,000</td>
                    <td className="px-6 py-4 text-right tabular-nums">14,50,000</td>
                    <td className="px-6 py-4 text-right tabular-nums text-destructive font-medium">-20.8%</td>
                    <td className="px-6 py-4 text-center"><span className="bg-destructive/10 text-destructive px-2 py-1 rounded text-xs font-semibold">AT RISK</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-border/50 bg-secondary/10 flex justify-center">
              <span className="text-sm text-muted-foreground">End of report (2 rows)</span>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="consumption" className="mt-0">
          <Alert>
            <FileText className="w-4 h-4" />
            <AlertDescription>Select a specific project from the top bar to generate the detailed consumption ledger.</AlertDescription>
          </Alert>
        </TabsContent>
        
        <TabsContent value="variance" className="mt-0">
           <Alert>
            <FileText className="w-4 h-4" />
            <AlertDescription>Select a specific project from the top bar to view item-wise variance.</AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}
