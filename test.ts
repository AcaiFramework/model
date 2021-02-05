// Packages
import test from "https://deno.land/x/acai_testing@1.0.9/mod.ts";

await test.find(/\S\.(test|tests)\.(js|ts)$/);
await test.run();