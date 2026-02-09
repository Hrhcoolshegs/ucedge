import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Customer } from '@/types';
import { Shield, CheckCircle2, AlertCircle, Clock, FileText } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface ComplianceTabProps {
  customer: Customer;
}

export const ComplianceTab = ({ customer }: ComplianceTabProps) => {
  const kycStatus = 'VERIFIED';
  const amlStatus = 'CLEAR';

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Compliance Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">KYC Status</p>
                <p className="text-xl font-bold text-green-600">{kycStatus}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">AML Status</p>
                <p className="text-xl font-bold text-blue-600">{amlStatus}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gray-50 border-gray-200">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Documents</p>
                <p className="text-xl font-bold text-gray-600">Complete</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-3">KYC Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer Type:</span>
                  <Badge variant="outline">{customer.entity_type || 'INDIVIDUAL'}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Onboarding Date:</span>
                  <span>{formatDate(customer.dateJoined)}</span>
                </div>
                {customer.unique_identifiers && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ID Verification:</span>
                    <div className="flex gap-1">
                      {Object.keys(customer.unique_identifiers).map((key) => (
                        <Badge key={key} variant="secondary" className="text-xs">
                          {key.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk Rating:</span>
                  <Badge variant={
                    customer.risk_rating === 'LOW' ? 'default' :
                    customer.risk_rating === 'HIGH' ? 'destructive' :
                    'secondary'
                  }>
                    {customer.risk_rating || 'MEDIUM'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default">{customer.status}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Consent Management</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">Marketing Communications</span>
                </div>
                <Badge variant="outline">Opted In</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">Data Processing</span>
                </div>
                <Badge variant="outline">Consented</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">Third-party Sharing</span>
                </div>
                <Badge variant="outline">Consented</Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Compliance Timeline</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">KYC Verification Completed</span>
                <span className="text-xs text-muted-foreground">{formatDate(customer.dateJoined)}</span>
              </div>
              <p className="text-xs text-muted-foreground">All identity documents verified successfully</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">Risk Assessment Completed</span>
                <span className="text-xs text-muted-foreground">{formatDate(customer.dateJoined)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Customer risk profile established</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
