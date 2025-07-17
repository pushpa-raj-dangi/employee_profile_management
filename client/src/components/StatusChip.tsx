import React from 'react';
import { Chip } from '@mui/material';
import { InvitationStatus } from '../types/enum/InvitationStatus';



const getChipColor = (status: InvitationStatus): "default" | "primary" | "secondary" | "success" | "warning" | "error" => {
  switch (status) {
    case InvitationStatus.PENDING:
      return 'warning';
    case InvitationStatus.COMPLETED:
      return 'success';
    case InvitationStatus.CANCELLED:
      return 'error';
    default:
      return 'default';
  }
};

const statusLabels: Record<InvitationStatus, string> = {
  [InvitationStatus.PENDING]: 'Pending',
  [InvitationStatus.COMPLETED]: 'Completed',
  [InvitationStatus.CANCELLED]: 'Cancelled',
};

type Props = {
  status: InvitationStatus;
};

const StatusChip: React.FC<Props> = ({ status }) => (
  <Chip label={statusLabels[status]} color={getChipColor(status)} />
);

export default StatusChip;
