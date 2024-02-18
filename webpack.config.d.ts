declare function _exports(): {
    entry: string;
    output: {
        path: string;
    };
    devServer: {
        open: boolean;
        host: string;
    };
    plugins: HtmlWebpackPlugin[];
    module: {
        rules: ({
            test: RegExp;
            loader: string;
            exclude: string[];
            use?: undefined;
            type?: undefined;
        } | {
            test: RegExp;
            use: string[];
            loader?: undefined;
            exclude?: undefined;
            type?: undefined;
        } | {
            test: RegExp;
            type: string;
            loader?: undefined;
            exclude?: undefined;
            use?: undefined;
        })[];
    };
    resolve: {
        extensions: string[];
        alias: {
            '@': string;
        };
    };
};
export = _exports;
import HtmlWebpackPlugin = require("html-webpack-plugin");
