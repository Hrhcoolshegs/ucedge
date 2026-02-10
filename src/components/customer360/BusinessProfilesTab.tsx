import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomerBusinessProfile } from '@/types';
import { Building2, CheckCircle2, XCircle, Clock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BusinessProfilesTabProps {
  customerId: string;
}

export const BusinessProfilesTab = ({ customerId }: BusinessProfilesTabProps) => {
  const [profiles, setProfiles] = useState<CustomerBusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!supabase) { setLoading(false); return; }
      const { data, error } = await supabase
        .from('customer_business_profiles')
        .select(`
          id,
          profile_status,
          kyc_status,
          tags,
          notes,
          created_at,
          business_unit:business_units (
            id,
            code,
            name,
            description
          ),
          relationship_owner:users!relationship_owner_user_id (
            id,
            full_name,
            email
          )
        `)
        .eq('customer_id', customerId);

      if (!error && data) {
        setProfiles(data as any);
      }
      setLoading(false);
    };

    fetchProfiles();
  }, [customerId]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  if (profiles.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground text-center py-8">
          No business profiles found
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Business Unit Relationships</h3>
        <p className="text-sm text-muted-foreground mb-6">
          This customer has relationships across {profiles.length} business {profiles.length === 1 ? 'unit' : 'units'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((profile) => (
            <Card key={profile.id} className="p-4 border-2">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {profile.business_unit?.name || 'Unknown Unit'}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {profile.business_unit?.code}
                    </p>
                  </div>
                </div>
                <Badge variant={profile.profile_status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {profile.profile_status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">KYC Status:</span>
                  <div className="flex items-center gap-1">
                    {profile.kyc_status === 'VERIFIED' && <CheckCircle2 className="h-4 w-4 text-success" />}
                    {profile.kyc_status === 'PENDING' && <Clock className="h-4 w-4 text-warning" />}
                    {profile.kyc_status === 'REJECTED' && <XCircle className="h-4 w-4 text-destructive" />}
                    <span className={
                      profile.kyc_status === 'VERIFIED' ? 'text-success' :
                      profile.kyc_status === 'PENDING' ? 'text-warning' :
                      'text-destructive'
                    }>
                      {profile.kyc_status}
                    </span>
                  </div>
                </div>

                {profile.relationship_owner && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Relationship Owner:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{profile.relationship_owner.full_name}</span>
                    </div>
                  </div>
                )}

                {profile.tags && profile.tags.length > 0 && (
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-1">
                      {profile.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profile.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground italic">{profile.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};
