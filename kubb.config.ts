import { pluginOas } from '@kubb/plugin-oas'
import { pluginClient } from '@kubb/plugin-client'
import { pluginTs } from '@kubb/plugin-ts'
import { defineConfig, type UserConfig } from '@kubb/core'
import { config } from "dotenv"
config();

const {
    API_FIBERLASER,
    API_FIBERLASER_SWAGGER
} = process.env as Record<string, string>;

interface ApiConfigParams {
    name: string;
    swaggerPath: string;
    outputPath: string;
    baseUrl: string;
}

// 2. Adicione ': UserConfig' no retorno da função para garantir a tipagem
const createApiConfig = ({ name, swaggerPath, outputPath, baseUrl }: ApiConfigParams): UserConfig => {
    return {
        name,
        root: '.',
        input: { path: swaggerPath },
        output: {
            path: outputPath,
            extension: {
                ".ts": "" as const,
            },
            clean: true,
        },
        plugins: [
            pluginOas(),
            pluginTs({
                output: { path: 'models' },
                dateType: 'date',
                enumType: 'enum',
                syntaxType: 'type',
            }),
            pluginClient({
                output: { path: 'client' },
                client: 'axios',
                importPath: '@/client',
                baseURL: baseUrl,
                dataReturnType: 'data',
            }),
        ],
    }
};

export default defineConfig(() => [

    createApiConfig({
        name: 'fiberlaser',
        swaggerPath: API_FIBERLASER_SWAGGER,
        outputPath: './src/api/fiberlaser',
        baseUrl: API_FIBERLASER
    }),
]);