#!/usr/bin/env node

/**
 * Basic validation script for ExtJS client
 * Validates JavaScript syntax, MCP integration, and ExtJS patterns
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateJavaScriptSyntax(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Skip validation for validation script itself
        if (filePath.endsWith('validate.js')) {
            return { valid: true };
        }
        
        // Basic syntax validation using node's built-in parser
        new Function(content);
        return { valid: true };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

function validateExtJSPatterns(content) {
    const patterns = {
        'Ext.define': content.includes('Ext.define'),
        'MCP Service': content.includes('MCPService') || content.includes('mcp'),
        'fetch API': content.includes('fetch('),
        'JSON-RPC': content.includes('jsonrpc'),
        'MCP tools': content.includes('tools/call') || content.includes('tools/list'),
        'Error handling': content.includes('try') && content.includes('catch'),
        'Todo operations': content.includes('create_todo') || content.includes('read_todos')
    };
    
    return patterns;
}

function validateHTMLStructure(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const checks = {
        'DOCTYPE declaration': content.includes('<!DOCTYPE'),
        'HTML tag': content.includes('<html'),
        'ExtJS CDN': content.includes('ext-all') || content.includes('ext.js'),
        'App script reference': content.includes('app.js'),
        'Head section': content.includes('<head>'),
        'Body section': content.includes('<body>')
    };
    
    return checks;
}

function runValidation() {
    log('blue', '🔍 Starting ExtJS Client Validation...\n');
    
    const results = {
        jsFiles: 0,
        htmlFiles: 0,
        errors: [],
        warnings: [],
        patterns: {}
    };
    
    // Find all relevant files
    const jsFiles = fs.readdirSync('.').filter(file => file.endsWith('.js'));
    const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
    
    // Validate JavaScript files
    log('yellow', '📄 Validating JavaScript files:');
    jsFiles.forEach(file => {
        const validation = validateJavaScriptSyntax(file);
        if (validation.valid) {
            log('green', `  ✅ ${file} - Syntax valid`);
            
            // Check ExtJS patterns
            const content = fs.readFileSync(file, 'utf8');
            const patterns = validateExtJSPatterns(content);
            
            Object.entries(patterns).forEach(([pattern, found]) => {
                if (found) {
                    log('green', `      ✅ ${pattern} found`);
                } else {
                    log('yellow', `      ⚠️  ${pattern} not found`);
                    results.warnings.push(`${file}: Missing ${pattern}`);
                }
            });
            
            results.patterns = { ...results.patterns, ...patterns };
        } else {
            log('red', `  ❌ ${file} - Syntax error: ${validation.error}`);
            results.errors.push(`${file}: ${validation.error}`);
        }
        results.jsFiles++;
    });
    
    // Validate HTML files
    log('yellow', '\n🌐 Validating HTML files:');
    htmlFiles.forEach(file => {
        try {
            const checks = validateHTMLStructure(file);
            log('green', `  ✅ ${file} - Structure valid`);
            
            Object.entries(checks).forEach(([check, passed]) => {
                if (passed) {
                    log('green', `      ✅ ${check}`);
                } else {
                    log('yellow', `      ⚠️  ${check} missing`);
                    results.warnings.push(`${file}: Missing ${check}`);
                }
            });
        } catch (error) {
            log('red', `  ❌ ${file} - Validation error: ${error.message}`);
            results.errors.push(`${file}: ${error.message}`);
        }
        results.htmlFiles++;
    });
    
    // Summary
    log('blue', '\n📊 Validation Summary:');
    log('green', `  JavaScript files validated: ${results.jsFiles}`);
    log('green', `  HTML files validated: ${results.htmlFiles}`);
    log('yellow', `  Warnings: ${results.warnings.length}`);
    log('red', `  Errors: ${results.errors.length}`);
    
    // MCP Integration Summary
    log('blue', '\n🔌 MCP Integration Check:');
    const mcpPatterns = ['MCP Service', 'fetch API', 'JSON-RPC', 'MCP tools'];
    const mcpScore = mcpPatterns.filter(pattern => results.patterns[pattern]).length;
    
    if (mcpScore === mcpPatterns.length) {
        log('green', '  ✅ Full MCP integration detected');
    } else if (mcpScore >= mcpPatterns.length / 2) {
        log('yellow', '  ⚠️  Partial MCP integration detected');
    } else {
        log('red', '  ❌ Limited or no MCP integration detected');
        results.errors.push('Missing MCP integration patterns');
    }
    
    // ExtJS Patterns Summary
    log('blue', '\n🏗️  ExtJS Framework Check:');
    const extjsPatterns = ['Ext.define', 'Error handling', 'Todo operations'];
    const extjsScore = extjsPatterns.filter(pattern => results.patterns[pattern]).length;
    
    if (extjsScore === extjsPatterns.length) {
        log('green', '  ✅ Proper ExtJS patterns detected');
    } else {
        log('yellow', '  ⚠️  Some ExtJS patterns missing');
    }
    
    // Generate report
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            jsFiles: results.jsFiles,
            htmlFiles: results.htmlFiles,
            errors: results.errors.length,
            warnings: results.warnings.length
        },
        mcpIntegration: mcpScore === mcpPatterns.length,
        extjsPatterns: extjsScore === extjsPatterns.length,
        details: {
            errors: results.errors,
            warnings: results.warnings,
            patterns: results.patterns
        }
    };
    
    fs.writeFileSync('validation-report.json', JSON.stringify(report, null, 2));
    log('blue', '\n📄 Detailed report saved to validation-report.json');
    
    // Exit with appropriate code
    if (results.errors.length > 0) {
        log('red', '\n❌ Validation failed with errors');
        process.exit(1);
    } else if (results.warnings.length > 0) {
        log('yellow', '\n⚠️  Validation passed with warnings');
        process.exit(0);
    } else {
        log('green', '\n✅ Validation passed successfully');
        process.exit(0);
    }
}

// Run validation if this script is called directly
if (require.main === module) {
    runValidation();
}

module.exports = {
    validateJavaScriptSyntax,
    validateExtJSPatterns,
    validateHTMLStructure,
    runValidation
};