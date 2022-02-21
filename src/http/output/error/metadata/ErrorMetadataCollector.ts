import type { HttpRequest } from '../../../../server/HttpRequest';
import { AsyncHandler } from '../../../../util/handlers/AsyncHandler';
import type { RepresentationMetadata } from '../../../representation/RepresentationMetadata';

export interface ErrorMetadataCollectorInput {
  /**
   * Metadata to update with error knowledge.
   */
  metadata: RepresentationMetadata;
  /**
   * Request corresponding to the error.
   */
  request: HttpRequest;
}

/**
 * Adds metadata about the error to the provided metadata object.
 */
export abstract class ErrorMetadataCollector extends AsyncHandler<ErrorMetadataCollectorInput> {}
