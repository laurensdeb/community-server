import { PermissionReader } from '..';
import type { PermissionReaderInput } from './PermissionReader';
import type { PermissionSet } from './permissions/Permissions';
import { AccessMode } from './permissions/Permissions';

export class TicketPermissionReader extends PermissionReader {
  public async handle(input: PermissionReaderInput): Promise<PermissionSet> {
    const result: PermissionSet = {};

    if (input.credentials.ticket?.resource === input.identifier && input.credentials.ticket?.modes) {
      result.ticket = this.ticketModesToPermissions(input.credentials.ticket.modes);
    }

    return result;
  }

  private ticketModesToPermissions(modes: Set<AccessMode>): Partial<Record<AccessMode, boolean>> {
    return Object.freeze({
      read: modes.has(AccessMode.read),
      write: modes.has(AccessMode.write),
      append: modes.has(AccessMode.append),
      create: modes.has(AccessMode.create),
      delete: modes.has(AccessMode.delete),
    });
  }
}
