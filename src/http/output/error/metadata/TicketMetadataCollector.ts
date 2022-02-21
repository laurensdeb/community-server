import { AccessMode } from '../../../../authorization/permissions/Permissions';
import { getLoggerFor } from '../../../../logging/LogUtil';
import { ACL, AUTH } from '../../../../util/Vocabularies';
import type { ErrorMetadataCollectorInput } from './ErrorMetadataCollector';
import { ErrorMetadataCollector } from './ErrorMetadataCollector';

const READ_METHODS = new Set([ 'GET', 'HEAD' ]);
const WRITE_METHODS = new Set([ 'PUT', 'DELETE', 'PATCH' ]);
const APPEND_METHODS = new Set([ 'POST' ]);

const VALID_MODES = new Set([ 'read', 'write', 'create', 'delete', 'append' ]);

export class TicketMetadataCollector extends ErrorMetadataCollector {
  protected readonly logger = getLoggerFor(this);

  public async handle({ request, metadata }: ErrorMetadataCollectorInput): Promise<void> {
    this.logger.debug(`Invoked TicketMetadataCollector`);

    const modes = new Set<AccessMode>();

    if (request.method && request.url) {
      metadata.add(AUTH.terms.ticketSubject, request.url);

      if (READ_METHODS.has(request.method)) {
        modes.add(AccessMode.read);
      }
      if (WRITE_METHODS.has(request.method)) {
        modes.add(AccessMode.write);
        modes.add(AccessMode.append);
        modes.add(AccessMode.create);
        modes.add(AccessMode.delete);
      } else if (APPEND_METHODS.has(request.method)) {
        modes.add(AccessMode.append);
      }

      for (const mode of modes) {
        if (VALID_MODES.has(mode)) {
          this.logger.debug(`Added ${mode}`);
          const capitalizedMode = mode.charAt(0).toUpperCase() + mode.slice(1) as 'Read' | 'Write' | 'Create' |
          'Append' | 'Delete';
          metadata.add(AUTH.terms.ticketNeeds, ACL.terms[capitalizedMode]);
        }
      }
    }
  }
}
