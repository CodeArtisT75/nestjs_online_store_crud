import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

interface IApiResponseContract {
  status?: number;
  model: any;
}

export const ApiResponseContract = (options: IApiResponseContract) => {
  const status = options.status || HttpStatus.OK;
  let data = {};
  let model;

  if (Array.isArray(options.model)) {
    model = options.model[0];
    data = {
      type: 'array',
      items: {
        $ref: getSchemaPath(model)
      }
    };
  } else {
    model = options.model;
    data = {
      $ref: getSchemaPath(options.model)
    };
  }

  if (!model) {
    return applyDecorators(
      ApiResponse({
        status,
        schema: {
          type: 'object',
          properties: {
            status: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            }
          }
        }
      })
    );
  }

  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'boolean'
          },
          data,
          message: {
            type: 'string'
          }
        }
      }
    })
  );
};
