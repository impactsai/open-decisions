// Generated from the normative JSON Schema. Run npm run comparison:generate.
"use strict";
export const kit = validate75;
const schema32 = {"type":"object","additionalProperties":false,"required":["profileVersion","kind","id","kitVersion","title","method","evidenceSlots","criteria","weightOrders","limits","recommendation"],"properties":{"profileVersion":{"$ref":"#/$defs/version"},"kind":{"const":"comparison-kit"},"id":{"$ref":"#/$defs/id"},"kitVersion":{"$ref":"#/$defs/id"},"title":{"$ref":"#/$defs/text"},"method":{"$ref":"#/$defs/method"},"evidenceSlots":{"type":"array","items":{"$ref":"#/$defs/evidenceSlot"},"minItems":1,"maxItems":32},"criteria":{"type":"array","items":{"$ref":"#/$defs/criterion"},"minItems":1,"maxItems":32},"weightOrders":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["higher","lower"],"properties":{"higher":{"$ref":"#/$defs/id"},"lower":{"$ref":"#/$defs/id"}}},"minItems":0,"maxItems":64},"limits":{"type":"object","additionalProperties":false,"required":["maxOptions","maxSamples","maxExactScenarios","maxWork"],"properties":{"maxOptions":{"type":"integer","minimum":2,"maximum":32},"maxSamples":{"type":"integer","minimum":100,"maximum":100000},"maxExactScenarios":{"type":"integer","minimum":1,"maximum":10000},"maxWork":{"type":"integer","minimum":1,"maximum":20000000}}},"recommendation":{"type":"object","additionalProperties":false,"required":["minSoleFirstPpm","minLeadPpm","maxExpectedRegretBp","requireValidatedModels"],"properties":{"minSoleFirstPpm":{"type":"integer","minimum":500001,"maximum":1000000},"minLeadPpm":{"type":"integer","minimum":1,"maximum":1000000},"maxExpectedRegretBp":{"$ref":"#/$defs/bp"},"requireValidatedModels":{"const":true}}}}};
const schema33 = {"const":"comparison/0.1.0-draft.1"};
const schema34 = {"type":"string","pattern":"^[A-Za-z][A-Za-z0-9._-]{0,63}$"};
const schema36 = {"type":"string","pattern":"^[\\s\\S]{1,2000}$"};
const schema37 = {"const":"smaa-weighted-sum-v1"};
const schema60 = {"type":"integer","minimum":0,"maximum":10000};
const func0 = Object.prototype.hasOwnProperty;
const pattern4 = new RegExp("^[A-Za-z][A-Za-z0-9._-]{0,63}$", "u");
const pattern6 = new RegExp("^[\\s\\S]{1,2000}$", "u");
const schema38 = {"type":"object","additionalProperties":false,"required":["id","description"],"properties":{"id":{"$ref":"#/$defs/id"},"description":{"$ref":"#/$defs/text"}}};

function validate22(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate22.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.id === undefined) || (!(func0.call(data, "id")))) && (missing0 = "id")) || (((data.description === undefined) || (!(func0.call(data, "description")))) && (missing0 = "description"))){
validate22.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!((key0 === "id") || (key0 === "description"))){
validate22.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined && func0.call(data, "id")){
let data0 = data.id;
const _errs2 = errors;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
validate22.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate22.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.description !== undefined && func0.call(data, "description")){
let data1 = data.description;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data1 === "string"){
if(!pattern6.test(data1)){
validate22.errors = [{instancePath:instancePath+"/description",schemaPath:"#/$defs/text/pattern",keyword:"pattern",params:{pattern: "^[\\s\\S]{1,2000}$"},message:"must match pattern \""+"^[\\s\\S]{1,2000}$"+"\""}];
return false;
}
}
else {
validate22.errors = [{instancePath:instancePath+"/description",schemaPath:"#/$defs/text/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate22.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate22.errors = vErrors;
return errors === 0;
}
validate22.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema41 = {"oneOf":[{"type":"object","additionalProperties":false,"required":["id","evaluator","requiredEvidenceSlots","role","scale","minSatisfactionPpm"],"properties":{"id":{"$ref":"#/$defs/id"},"evaluator":{"$ref":"#/$defs/evaluator"},"requiredEvidenceSlots":{"type":"array","items":{"$ref":"#/$defs/id"},"minItems":1,"maxItems":16},"role":{"const":"constraint"},"scale":{"type":"object","additionalProperties":false,"required":["kind"],"properties":{"kind":{"const":"boolean"}}},"minSatisfactionPpm":{"type":"integer","minimum":1,"maximum":1000000},"acceptedCalibrationDigests":{"type":"array","items":{"$ref":"#/$defs/digest"},"maxItems":16}}},{"type":"object","additionalProperties":false,"required":["id","evaluator","requiredEvidenceSlots","role","scale","weightBounds"],"properties":{"id":{"$ref":"#/$defs/id"},"evaluator":{"$ref":"#/$defs/evaluator"},"requiredEvidenceSlots":{"type":"array","items":{"$ref":"#/$defs/id"},"minItems":1,"maxItems":16},"role":{"const":"preference"},"scale":{"$ref":"#/$defs/scale"},"weightBounds":{"type":"object","additionalProperties":false,"required":["minBp","maxBp"],"properties":{"minBp":{"$ref":"#/$defs/bp"},"maxBp":{"$ref":"#/$defs/bp"}}},"acceptedCalibrationDigests":{"type":"array","items":{"$ref":"#/$defs/digest"},"maxItems":16}}}]};
const schema51 = {"type":"string","pattern":"^[0-9a-f]{64}$"};
const pattern17 = new RegExp("^[0-9a-f]{64}$", "u");
const schema43 = {"oneOf":[{"type":"object","additionalProperties":false,"required":["kind","id","methodVersion"],"properties":{"kind":{"enum":["measurement","human"]},"id":{"$ref":"#/$defs/id"},"methodVersion":{"$ref":"#/$defs/id"}}},{"type":"object","additionalProperties":false,"required":["kind","id","methodVersion","provider","model","modelVersion","promptDigest","mappingDigest"],"properties":{"kind":{"const":"model"},"id":{"$ref":"#/$defs/id"},"methodVersion":{"$ref":"#/$defs/id"},"provider":{"$ref":"#/$defs/id"},"model":{"$ref":"#/$defs/text"},"modelVersion":{"$ref":"#/$defs/text"},"promptDigest":{"$ref":"#/$defs/digest"},"mappingDigest":{"$ref":"#/$defs/digest"}}}]};

function validate25(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate25.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
let valid0 = false;
let passing0 = null;
const _errs1 = errors;
if(errors === _errs1){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing0 = "kind")) || (((data.id === undefined) || (!(func0.call(data, "id")))) && (missing0 = "id"))) || (((data.methodVersion === undefined) || (!(func0.call(data, "methodVersion")))) && (missing0 = "methodVersion"))){
const err0 = {instancePath,schemaPath:"#/oneOf/0/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
const _errs3 = errors;
for(const key0 of Object.keys(data)){
if(!(((key0 === "kind") || (key0 === "id")) || (key0 === "methodVersion"))){
const err1 = {instancePath,schemaPath:"#/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
break;
}
}
if(_errs3 === errors){
if(data.kind !== undefined && func0.call(data, "kind")){
let data0 = data.kind;
const _errs4 = errors;
if(!((data0 === "measurement") || (data0 === "human"))){
const err2 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/0/properties/kind/enum",keyword:"enum",params:{allowedValues: schema43.oneOf[0].properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var valid1 = _errs4 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.id !== undefined && func0.call(data, "id")){
let data1 = data.id;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data1 === "string"){
if(!pattern4.test(data1)){
const err3 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
else {
const err4 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
var valid1 = _errs5 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.methodVersion !== undefined && func0.call(data, "methodVersion")){
let data2 = data.methodVersion;
const _errs8 = errors;
const _errs9 = errors;
if(errors === _errs9){
if(typeof data2 === "string"){
if(!pattern4.test(data2)){
const err5 = {instancePath:instancePath+"/methodVersion",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath:instancePath+"/methodVersion",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
var valid1 = _errs8 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
}
else {
const err7 = {instancePath,schemaPath:"#/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
var _valid0 = _errs1 === errors;
if(_valid0){
valid0 = true;
passing0 = 0;
var props0 = true;
}
const _errs11 = errors;
if(errors === _errs11){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if((((((((((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing1 = "kind")) || (((data.id === undefined) || (!(func0.call(data, "id")))) && (missing1 = "id"))) || (((data.methodVersion === undefined) || (!(func0.call(data, "methodVersion")))) && (missing1 = "methodVersion"))) || (((data.provider === undefined) || (!(func0.call(data, "provider")))) && (missing1 = "provider"))) || (((data.model === undefined) || (!(func0.call(data, "model")))) && (missing1 = "model"))) || (((data.modelVersion === undefined) || (!(func0.call(data, "modelVersion")))) && (missing1 = "modelVersion"))) || (((data.promptDigest === undefined) || (!(func0.call(data, "promptDigest")))) && (missing1 = "promptDigest"))) || (((data.mappingDigest === undefined) || (!(func0.call(data, "mappingDigest")))) && (missing1 = "mappingDigest"))){
const err8 = {instancePath,schemaPath:"#/oneOf/1/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
else {
const _errs13 = errors;
for(const key1 of Object.keys(data)){
if(!((((((((key1 === "kind") || (key1 === "id")) || (key1 === "methodVersion")) || (key1 === "provider")) || (key1 === "model")) || (key1 === "modelVersion")) || (key1 === "promptDigest")) || (key1 === "mappingDigest"))){
const err9 = {instancePath,schemaPath:"#/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
break;
}
}
if(_errs13 === errors){
if(data.kind !== undefined && func0.call(data, "kind")){
const _errs14 = errors;
if("model" !== data.kind){
const err10 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/1/properties/kind/const",keyword:"const",params:{allowedValue: "model"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
var valid4 = _errs14 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data.id !== undefined && func0.call(data, "id")){
let data4 = data.id;
const _errs15 = errors;
const _errs16 = errors;
if(errors === _errs16){
if(typeof data4 === "string"){
if(!pattern4.test(data4)){
const err11 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
var valid4 = _errs15 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data.methodVersion !== undefined && func0.call(data, "methodVersion")){
let data5 = data.methodVersion;
const _errs18 = errors;
const _errs19 = errors;
if(errors === _errs19){
if(typeof data5 === "string"){
if(!pattern4.test(data5)){
const err13 = {instancePath:instancePath+"/methodVersion",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/methodVersion",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
var valid4 = _errs18 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data.provider !== undefined && func0.call(data, "provider")){
let data6 = data.provider;
const _errs21 = errors;
const _errs22 = errors;
if(errors === _errs22){
if(typeof data6 === "string"){
if(!pattern4.test(data6)){
const err15 = {instancePath:instancePath+"/provider",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
else {
const err16 = {instancePath:instancePath+"/provider",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
var valid4 = _errs21 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data.model !== undefined && func0.call(data, "model")){
let data7 = data.model;
const _errs24 = errors;
const _errs25 = errors;
if(errors === _errs25){
if(typeof data7 === "string"){
if(!pattern6.test(data7)){
const err17 = {instancePath:instancePath+"/model",schemaPath:"#/$defs/text/pattern",keyword:"pattern",params:{pattern: "^[\\s\\S]{1,2000}$"},message:"must match pattern \""+"^[\\s\\S]{1,2000}$"+"\""};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
else {
const err18 = {instancePath:instancePath+"/model",schemaPath:"#/$defs/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
var valid4 = _errs24 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data.modelVersion !== undefined && func0.call(data, "modelVersion")){
let data8 = data.modelVersion;
const _errs27 = errors;
const _errs28 = errors;
if(errors === _errs28){
if(typeof data8 === "string"){
if(!pattern6.test(data8)){
const err19 = {instancePath:instancePath+"/modelVersion",schemaPath:"#/$defs/text/pattern",keyword:"pattern",params:{pattern: "^[\\s\\S]{1,2000}$"},message:"must match pattern \""+"^[\\s\\S]{1,2000}$"+"\""};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
else {
const err20 = {instancePath:instancePath+"/modelVersion",schemaPath:"#/$defs/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
var valid4 = _errs27 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data.promptDigest !== undefined && func0.call(data, "promptDigest")){
let data9 = data.promptDigest;
const _errs30 = errors;
const _errs31 = errors;
if(errors === _errs31){
if(typeof data9 === "string"){
if(!pattern17.test(data9)){
const err21 = {instancePath:instancePath+"/promptDigest",schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
else {
const err22 = {instancePath:instancePath+"/promptDigest",schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
var valid4 = _errs30 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data.mappingDigest !== undefined && func0.call(data, "mappingDigest")){
let data10 = data.mappingDigest;
const _errs33 = errors;
const _errs34 = errors;
if(errors === _errs34){
if(typeof data10 === "string"){
if(!pattern17.test(data10)){
const err23 = {instancePath:instancePath+"/mappingDigest",schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
else {
const err24 = {instancePath:instancePath+"/mappingDigest",schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
var valid4 = _errs33 === errors;
}
else {
var valid4 = true;
}
}
}
}
}
}
}
}
}
}
}
else {
const err25 = {instancePath,schemaPath:"#/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
var _valid0 = _errs11 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid0 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
}
if(!valid0){
const err26 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
validate25.errors = vErrors;
return false;
}
else {
errors = _errs0;
if(vErrors !== null){
if(_errs0){
vErrors.length = _errs0;
}
else {
vErrors = null;
}
}
}
validate25.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate25.evaluated = {"dynamicProps":true,"dynamicItems":false};

const schema57 = {"oneOf":[{"type":"object","additionalProperties":false,"required":["kind"],"properties":{"kind":{"const":"boolean"}}},{"type":"object","additionalProperties":false,"required":["kind","minimum","maximum","direction","unit"],"properties":{"kind":{"const":"numeric"},"minimum":{"type":"integer","minimum":-1000000000,"maximum":1000000000},"maximum":{"type":"integer","minimum":-1000000000,"maximum":1000000000},"direction":{"enum":["maximize","minimize"]},"unit":{"$ref":"#/$defs/id"}}},{"type":"object","additionalProperties":false,"required":["kind","levels"],"properties":{"kind":{"const":"categorical"},"levels":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["id","utilityBp"],"properties":{"id":{"$ref":"#/$defs/id"},"utilityBp":{"$ref":"#/$defs/bp"}}},"minItems":2,"maxItems":32}}}]};

function validate28(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate28.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
let valid0 = false;
let passing0 = null;
const _errs1 = errors;
if(errors === _errs1){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing0 = "kind")){
const err0 = {instancePath,schemaPath:"#/oneOf/0/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
const _errs3 = errors;
for(const key0 of Object.keys(data)){
if(!(key0 === "kind")){
const err1 = {instancePath,schemaPath:"#/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
break;
}
}
if(_errs3 === errors){
if(data.kind !== undefined && func0.call(data, "kind")){
if("boolean" !== data.kind){
const err2 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/0/properties/kind/const",keyword:"const",params:{allowedValue: "boolean"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
}
}
}
else {
const err3 = {instancePath,schemaPath:"#/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
var _valid0 = _errs1 === errors;
if(_valid0){
valid0 = true;
passing0 = 0;
var props0 = true;
}
const _errs5 = errors;
if(errors === _errs5){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if(((((((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing1 = "kind")) || (((data.minimum === undefined) || (!(func0.call(data, "minimum")))) && (missing1 = "minimum"))) || (((data.maximum === undefined) || (!(func0.call(data, "maximum")))) && (missing1 = "maximum"))) || (((data.direction === undefined) || (!(func0.call(data, "direction")))) && (missing1 = "direction"))) || (((data.unit === undefined) || (!(func0.call(data, "unit")))) && (missing1 = "unit"))){
const err4 = {instancePath,schemaPath:"#/oneOf/1/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
else {
const _errs7 = errors;
for(const key1 of Object.keys(data)){
if(!(((((key1 === "kind") || (key1 === "minimum")) || (key1 === "maximum")) || (key1 === "direction")) || (key1 === "unit"))){
const err5 = {instancePath,schemaPath:"#/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
break;
}
}
if(_errs7 === errors){
if(data.kind !== undefined && func0.call(data, "kind")){
const _errs8 = errors;
if("numeric" !== data.kind){
const err6 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/1/properties/kind/const",keyword:"const",params:{allowedValue: "numeric"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var valid2 = _errs8 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data.minimum !== undefined && func0.call(data, "minimum")){
let data2 = data.minimum;
const _errs9 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
const err7 = {instancePath:instancePath+"/minimum",schemaPath:"#/oneOf/1/properties/minimum/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(errors === _errs9){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 1000000000 || isNaN(data2)){
const err8 = {instancePath:instancePath+"/minimum",schemaPath:"#/oneOf/1/properties/minimum/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000000},message:"must be <= 1000000000"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
else {
if(data2 < -1000000000 || isNaN(data2)){
const err9 = {instancePath:instancePath+"/minimum",schemaPath:"#/oneOf/1/properties/minimum/minimum",keyword:"minimum",params:{comparison: ">=", limit: -1000000000},message:"must be >= -1000000000"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
}
var valid2 = _errs9 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data.maximum !== undefined && func0.call(data, "maximum")){
let data3 = data.maximum;
const _errs11 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
const err10 = {instancePath:instancePath+"/maximum",schemaPath:"#/oneOf/1/properties/maximum/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(errors === _errs11){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 1000000000 || isNaN(data3)){
const err11 = {instancePath:instancePath+"/maximum",schemaPath:"#/oneOf/1/properties/maximum/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000000},message:"must be <= 1000000000"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
else {
if(data3 < -1000000000 || isNaN(data3)){
const err12 = {instancePath:instancePath+"/maximum",schemaPath:"#/oneOf/1/properties/maximum/minimum",keyword:"minimum",params:{comparison: ">=", limit: -1000000000},message:"must be >= -1000000000"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
}
var valid2 = _errs11 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data.direction !== undefined && func0.call(data, "direction")){
let data4 = data.direction;
const _errs13 = errors;
if(!((data4 === "maximize") || (data4 === "minimize"))){
const err13 = {instancePath:instancePath+"/direction",schemaPath:"#/oneOf/1/properties/direction/enum",keyword:"enum",params:{allowedValues: schema57.oneOf[1].properties.direction.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
var valid2 = _errs13 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data.unit !== undefined && func0.call(data, "unit")){
let data5 = data.unit;
const _errs14 = errors;
const _errs15 = errors;
if(errors === _errs15){
if(typeof data5 === "string"){
if(!pattern4.test(data5)){
const err14 = {instancePath:instancePath+"/unit",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/unit",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
var valid2 = _errs14 === errors;
}
else {
var valid2 = true;
}
}
}
}
}
}
}
}
else {
const err16 = {instancePath,schemaPath:"#/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
var _valid0 = _errs5 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid0 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
const _errs17 = errors;
if(errors === _errs17){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing2;
if((((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing2 = "kind")) || (((data.levels === undefined) || (!(func0.call(data, "levels")))) && (missing2 = "levels"))){
const err17 = {instancePath,schemaPath:"#/oneOf/2/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
else {
const _errs19 = errors;
for(const key2 of Object.keys(data)){
if(!((key2 === "kind") || (key2 === "levels"))){
const err18 = {instancePath,schemaPath:"#/oneOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
break;
}
}
if(_errs19 === errors){
if(data.kind !== undefined && func0.call(data, "kind")){
const _errs20 = errors;
if("categorical" !== data.kind){
const err19 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/2/properties/kind/const",keyword:"const",params:{allowedValue: "categorical"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
var valid4 = _errs20 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data.levels !== undefined && func0.call(data, "levels")){
let data7 = data.levels;
const _errs21 = errors;
if(errors === _errs21){
if(Array.isArray(data7)){
if(data7.length > 32){
const err20 = {instancePath:instancePath+"/levels",schemaPath:"#/oneOf/2/properties/levels/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
else {
if(data7.length < 2){
const err21 = {instancePath:instancePath+"/levels",schemaPath:"#/oneOf/2/properties/levels/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
else {
var valid5 = true;
const len0 = data7.length;
for(let i0=0; i0<len0; i0++){
let data8 = data7[i0];
const _errs23 = errors;
if(errors === _errs23){
if(data8 && typeof data8 == "object" && !Array.isArray(data8)){
let missing3;
if((((data8.id === undefined) || (!(func0.call(data8, "id")))) && (missing3 = "id")) || (((data8.utilityBp === undefined) || (!(func0.call(data8, "utilityBp")))) && (missing3 = "utilityBp"))){
const err22 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/oneOf/2/properties/levels/items/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
else {
const _errs25 = errors;
for(const key3 of Object.keys(data8)){
if(!((key3 === "id") || (key3 === "utilityBp"))){
const err23 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/oneOf/2/properties/levels/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
break;
}
}
if(_errs25 === errors){
if(data8.id !== undefined && func0.call(data8, "id")){
let data9 = data8.id;
const _errs26 = errors;
const _errs27 = errors;
if(errors === _errs27){
if(typeof data9 === "string"){
if(!pattern4.test(data9)){
const err24 = {instancePath:instancePath+"/levels/" + i0+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
else {
const err25 = {instancePath:instancePath+"/levels/" + i0+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
var valid6 = _errs26 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data8.utilityBp !== undefined && func0.call(data8, "utilityBp")){
let data10 = data8.utilityBp;
const _errs29 = errors;
const _errs30 = errors;
if(!(((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10))) && (isFinite(data10)))){
const err26 = {instancePath:instancePath+"/levels/" + i0+"/utilityBp",schemaPath:"#/$defs/bp/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(errors === _errs30){
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 10000 || isNaN(data10)){
const err27 = {instancePath:instancePath+"/levels/" + i0+"/utilityBp",schemaPath:"#/$defs/bp/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
else {
if(data10 < 0 || isNaN(data10)){
const err28 = {instancePath:instancePath+"/levels/" + i0+"/utilityBp",schemaPath:"#/$defs/bp/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
}
}
var valid6 = _errs29 === errors;
}
else {
var valid6 = true;
}
}
}
}
}
else {
const err29 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/oneOf/2/properties/levels/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
var valid5 = _errs23 === errors;
if(!valid5){
break;
}
}
}
}
}
else {
const err30 = {instancePath:instancePath+"/levels",schemaPath:"#/oneOf/2/properties/levels/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
var valid4 = _errs21 === errors;
}
else {
var valid4 = true;
}
}
}
}
}
else {
const err31 = {instancePath,schemaPath:"#/oneOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
var _valid0 = _errs17 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 2];
}
else {
if(_valid0){
valid0 = true;
passing0 = 2;
if(props0 !== true){
props0 = true;
}
}
}
}
if(!valid0){
const err32 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
validate28.errors = vErrors;
return false;
}
else {
errors = _errs0;
if(vErrors !== null){
if(_errs0){
vErrors.length = _errs0;
}
else {
vErrors = null;
}
}
}
validate28.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate28.evaluated = {"dynamicProps":true,"dynamicItems":false};


function validate24(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate24.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
let valid0 = false;
let passing0 = null;
const _errs1 = errors;
if(errors === _errs1){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.id === undefined) || (!(func0.call(data, "id")))) && (missing0 = "id")) || (((data.evaluator === undefined) || (!(func0.call(data, "evaluator")))) && (missing0 = "evaluator"))) || (((data.requiredEvidenceSlots === undefined) || (!(func0.call(data, "requiredEvidenceSlots")))) && (missing0 = "requiredEvidenceSlots"))) || (((data.role === undefined) || (!(func0.call(data, "role")))) && (missing0 = "role"))) || (((data.scale === undefined) || (!(func0.call(data, "scale")))) && (missing0 = "scale"))) || (((data.minSatisfactionPpm === undefined) || (!(func0.call(data, "minSatisfactionPpm")))) && (missing0 = "minSatisfactionPpm"))){
const err0 = {instancePath,schemaPath:"#/oneOf/0/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
const _errs3 = errors;
for(const key0 of Object.keys(data)){
if(!(((((((key0 === "id") || (key0 === "evaluator")) || (key0 === "requiredEvidenceSlots")) || (key0 === "role")) || (key0 === "scale")) || (key0 === "minSatisfactionPpm")) || (key0 === "acceptedCalibrationDigests"))){
const err1 = {instancePath,schemaPath:"#/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
break;
}
}
if(_errs3 === errors){
if(data.id !== undefined && func0.call(data, "id")){
let data0 = data.id;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
const err2 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
var valid1 = _errs4 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.evaluator !== undefined && func0.call(data, "evaluator")){
const _errs7 = errors;
if(!(validate25(data.evaluator, {instancePath:instancePath+"/evaluator",parentData:data,parentDataProperty:"evaluator",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
errors = vErrors.length;
}
var valid1 = _errs7 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.requiredEvidenceSlots !== undefined && func0.call(data, "requiredEvidenceSlots")){
let data2 = data.requiredEvidenceSlots;
const _errs8 = errors;
if(errors === _errs8){
if(Array.isArray(data2)){
if(data2.length > 16){
const err4 = {instancePath:instancePath+"/requiredEvidenceSlots",schemaPath:"#/oneOf/0/properties/requiredEvidenceSlots/maxItems",keyword:"maxItems",params:{limit: 16},message:"must NOT have more than 16 items"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
else {
if(data2.length < 1){
const err5 = {instancePath:instancePath+"/requiredEvidenceSlots",schemaPath:"#/oneOf/0/properties/requiredEvidenceSlots/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
else {
var valid3 = true;
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
let data3 = data2[i0];
const _errs10 = errors;
const _errs11 = errors;
if(errors === _errs11){
if(typeof data3 === "string"){
if(!pattern4.test(data3)){
const err6 = {instancePath:instancePath+"/requiredEvidenceSlots/" + i0,schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
else {
const err7 = {instancePath:instancePath+"/requiredEvidenceSlots/" + i0,schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
var valid3 = _errs10 === errors;
if(!valid3){
break;
}
}
}
}
}
else {
const err8 = {instancePath:instancePath+"/requiredEvidenceSlots",schemaPath:"#/oneOf/0/properties/requiredEvidenceSlots/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
var valid1 = _errs8 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.role !== undefined && func0.call(data, "role")){
const _errs13 = errors;
if("constraint" !== data.role){
const err9 = {instancePath:instancePath+"/role",schemaPath:"#/oneOf/0/properties/role/const",keyword:"const",params:{allowedValue: "constraint"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
var valid1 = _errs13 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.scale !== undefined && func0.call(data, "scale")){
let data5 = data.scale;
const _errs14 = errors;
if(errors === _errs14){
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
let missing1;
if(((data5.kind === undefined) || (!(func0.call(data5, "kind")))) && (missing1 = "kind")){
const err10 = {instancePath:instancePath+"/scale",schemaPath:"#/oneOf/0/properties/scale/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
else {
const _errs16 = errors;
for(const key1 of Object.keys(data5)){
if(!(key1 === "kind")){
const err11 = {instancePath:instancePath+"/scale",schemaPath:"#/oneOf/0/properties/scale/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
break;
}
}
if(_errs16 === errors){
if(data5.kind !== undefined && func0.call(data5, "kind")){
if("boolean" !== data5.kind){
const err12 = {instancePath:instancePath+"/scale/kind",schemaPath:"#/oneOf/0/properties/scale/properties/kind/const",keyword:"const",params:{allowedValue: "boolean"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
}
}
else {
const err13 = {instancePath:instancePath+"/scale",schemaPath:"#/oneOf/0/properties/scale/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
var valid1 = _errs14 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.minSatisfactionPpm !== undefined && func0.call(data, "minSatisfactionPpm")){
let data7 = data.minSatisfactionPpm;
const _errs18 = errors;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
const err14 = {instancePath:instancePath+"/minSatisfactionPpm",schemaPath:"#/oneOf/0/properties/minSatisfactionPpm/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(errors === _errs18){
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 1000000 || isNaN(data7)){
const err15 = {instancePath:instancePath+"/minSatisfactionPpm",schemaPath:"#/oneOf/0/properties/minSatisfactionPpm/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000},message:"must be <= 1000000"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
else {
if(data7 < 1 || isNaN(data7)){
const err16 = {instancePath:instancePath+"/minSatisfactionPpm",schemaPath:"#/oneOf/0/properties/minSatisfactionPpm/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
}
}
var valid1 = _errs18 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.acceptedCalibrationDigests !== undefined && func0.call(data, "acceptedCalibrationDigests")){
let data8 = data.acceptedCalibrationDigests;
const _errs20 = errors;
if(errors === _errs20){
if(Array.isArray(data8)){
if(data8.length > 16){
const err17 = {instancePath:instancePath+"/acceptedCalibrationDigests",schemaPath:"#/oneOf/0/properties/acceptedCalibrationDigests/maxItems",keyword:"maxItems",params:{limit: 16},message:"must NOT have more than 16 items"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
else {
var valid6 = true;
const len1 = data8.length;
for(let i1=0; i1<len1; i1++){
let data9 = data8[i1];
const _errs22 = errors;
const _errs23 = errors;
if(errors === _errs23){
if(typeof data9 === "string"){
if(!pattern17.test(data9)){
const err18 = {instancePath:instancePath+"/acceptedCalibrationDigests/" + i1,schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/acceptedCalibrationDigests/" + i1,schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
var valid6 = _errs22 === errors;
if(!valid6){
break;
}
}
}
}
else {
const err20 = {instancePath:instancePath+"/acceptedCalibrationDigests",schemaPath:"#/oneOf/0/properties/acceptedCalibrationDigests/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
var valid1 = _errs20 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
}
}
}
}
}
else {
const err21 = {instancePath,schemaPath:"#/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
var _valid0 = _errs1 === errors;
if(_valid0){
valid0 = true;
passing0 = 0;
var props1 = true;
}
const _errs25 = errors;
if(errors === _errs25){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing2;
if((((((((data.id === undefined) || (!(func0.call(data, "id")))) && (missing2 = "id")) || (((data.evaluator === undefined) || (!(func0.call(data, "evaluator")))) && (missing2 = "evaluator"))) || (((data.requiredEvidenceSlots === undefined) || (!(func0.call(data, "requiredEvidenceSlots")))) && (missing2 = "requiredEvidenceSlots"))) || (((data.role === undefined) || (!(func0.call(data, "role")))) && (missing2 = "role"))) || (((data.scale === undefined) || (!(func0.call(data, "scale")))) && (missing2 = "scale"))) || (((data.weightBounds === undefined) || (!(func0.call(data, "weightBounds")))) && (missing2 = "weightBounds"))){
const err22 = {instancePath,schemaPath:"#/oneOf/1/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
else {
const _errs27 = errors;
for(const key2 of Object.keys(data)){
if(!(((((((key2 === "id") || (key2 === "evaluator")) || (key2 === "requiredEvidenceSlots")) || (key2 === "role")) || (key2 === "scale")) || (key2 === "weightBounds")) || (key2 === "acceptedCalibrationDigests"))){
const err23 = {instancePath,schemaPath:"#/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
break;
}
}
if(_errs27 === errors){
if(data.id !== undefined && func0.call(data, "id")){
let data10 = data.id;
const _errs28 = errors;
const _errs29 = errors;
if(errors === _errs29){
if(typeof data10 === "string"){
if(!pattern4.test(data10)){
const err24 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
else {
const err25 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
var valid8 = _errs28 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data.evaluator !== undefined && func0.call(data, "evaluator")){
const _errs31 = errors;
if(!(validate25(data.evaluator, {instancePath:instancePath+"/evaluator",parentData:data,parentDataProperty:"evaluator",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
errors = vErrors.length;
}
var valid8 = _errs31 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data.requiredEvidenceSlots !== undefined && func0.call(data, "requiredEvidenceSlots")){
let data12 = data.requiredEvidenceSlots;
const _errs32 = errors;
if(errors === _errs32){
if(Array.isArray(data12)){
if(data12.length > 16){
const err26 = {instancePath:instancePath+"/requiredEvidenceSlots",schemaPath:"#/oneOf/1/properties/requiredEvidenceSlots/maxItems",keyword:"maxItems",params:{limit: 16},message:"must NOT have more than 16 items"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
else {
if(data12.length < 1){
const err27 = {instancePath:instancePath+"/requiredEvidenceSlots",schemaPath:"#/oneOf/1/properties/requiredEvidenceSlots/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
else {
var valid10 = true;
const len2 = data12.length;
for(let i2=0; i2<len2; i2++){
let data13 = data12[i2];
const _errs34 = errors;
const _errs35 = errors;
if(errors === _errs35){
if(typeof data13 === "string"){
if(!pattern4.test(data13)){
const err28 = {instancePath:instancePath+"/requiredEvidenceSlots/" + i2,schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
else {
const err29 = {instancePath:instancePath+"/requiredEvidenceSlots/" + i2,schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
var valid10 = _errs34 === errors;
if(!valid10){
break;
}
}
}
}
}
else {
const err30 = {instancePath:instancePath+"/requiredEvidenceSlots",schemaPath:"#/oneOf/1/properties/requiredEvidenceSlots/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
var valid8 = _errs32 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data.role !== undefined && func0.call(data, "role")){
const _errs37 = errors;
if("preference" !== data.role){
const err31 = {instancePath:instancePath+"/role",schemaPath:"#/oneOf/1/properties/role/const",keyword:"const",params:{allowedValue: "preference"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
var valid8 = _errs37 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data.scale !== undefined && func0.call(data, "scale")){
const _errs38 = errors;
if(!(validate28(data.scale, {instancePath:instancePath+"/scale",parentData:data,parentDataProperty:"scale",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate28.errors : vErrors.concat(validate28.errors);
errors = vErrors.length;
}
var valid8 = _errs38 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data.weightBounds !== undefined && func0.call(data, "weightBounds")){
let data16 = data.weightBounds;
const _errs39 = errors;
if(errors === _errs39){
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
let missing3;
if((((data16.minBp === undefined) || (!(func0.call(data16, "minBp")))) && (missing3 = "minBp")) || (((data16.maxBp === undefined) || (!(func0.call(data16, "maxBp")))) && (missing3 = "maxBp"))){
const err32 = {instancePath:instancePath+"/weightBounds",schemaPath:"#/oneOf/1/properties/weightBounds/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
else {
const _errs41 = errors;
for(const key3 of Object.keys(data16)){
if(!((key3 === "minBp") || (key3 === "maxBp"))){
const err33 = {instancePath:instancePath+"/weightBounds",schemaPath:"#/oneOf/1/properties/weightBounds/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
break;
}
}
if(_errs41 === errors){
if(data16.minBp !== undefined && func0.call(data16, "minBp")){
let data17 = data16.minBp;
const _errs42 = errors;
const _errs43 = errors;
if(!(((typeof data17 == "number") && (!(data17 % 1) && !isNaN(data17))) && (isFinite(data17)))){
const err34 = {instancePath:instancePath+"/weightBounds/minBp",schemaPath:"#/$defs/bp/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(errors === _errs43){
if((typeof data17 == "number") && (isFinite(data17))){
if(data17 > 10000 || isNaN(data17)){
const err35 = {instancePath:instancePath+"/weightBounds/minBp",schemaPath:"#/$defs/bp/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
else {
if(data17 < 0 || isNaN(data17)){
const err36 = {instancePath:instancePath+"/weightBounds/minBp",schemaPath:"#/$defs/bp/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
}
}
var valid12 = _errs42 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data16.maxBp !== undefined && func0.call(data16, "maxBp")){
let data18 = data16.maxBp;
const _errs45 = errors;
const _errs46 = errors;
if(!(((typeof data18 == "number") && (!(data18 % 1) && !isNaN(data18))) && (isFinite(data18)))){
const err37 = {instancePath:instancePath+"/weightBounds/maxBp",schemaPath:"#/$defs/bp/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(errors === _errs46){
if((typeof data18 == "number") && (isFinite(data18))){
if(data18 > 10000 || isNaN(data18)){
const err38 = {instancePath:instancePath+"/weightBounds/maxBp",schemaPath:"#/$defs/bp/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
else {
if(data18 < 0 || isNaN(data18)){
const err39 = {instancePath:instancePath+"/weightBounds/maxBp",schemaPath:"#/$defs/bp/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
}
}
var valid12 = _errs45 === errors;
}
else {
var valid12 = true;
}
}
}
}
}
else {
const err40 = {instancePath:instancePath+"/weightBounds",schemaPath:"#/oneOf/1/properties/weightBounds/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
var valid8 = _errs39 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data.acceptedCalibrationDigests !== undefined && func0.call(data, "acceptedCalibrationDigests")){
let data19 = data.acceptedCalibrationDigests;
const _errs48 = errors;
if(errors === _errs48){
if(Array.isArray(data19)){
if(data19.length > 16){
const err41 = {instancePath:instancePath+"/acceptedCalibrationDigests",schemaPath:"#/oneOf/1/properties/acceptedCalibrationDigests/maxItems",keyword:"maxItems",params:{limit: 16},message:"must NOT have more than 16 items"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
else {
var valid15 = true;
const len3 = data19.length;
for(let i3=0; i3<len3; i3++){
let data20 = data19[i3];
const _errs50 = errors;
const _errs51 = errors;
if(errors === _errs51){
if(typeof data20 === "string"){
if(!pattern17.test(data20)){
const err42 = {instancePath:instancePath+"/acceptedCalibrationDigests/" + i3,schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
else {
const err43 = {instancePath:instancePath+"/acceptedCalibrationDigests/" + i3,schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
var valid15 = _errs50 === errors;
if(!valid15){
break;
}
}
}
}
else {
const err44 = {instancePath:instancePath+"/acceptedCalibrationDigests",schemaPath:"#/oneOf/1/properties/acceptedCalibrationDigests/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
var valid8 = _errs48 === errors;
}
else {
var valid8 = true;
}
}
}
}
}
}
}
}
}
}
else {
const err45 = {instancePath,schemaPath:"#/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
var _valid0 = _errs25 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid0 = true;
passing0 = 1;
if(props1 !== true){
props1 = true;
}
}
}
if(!valid0){
const err46 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
validate24.errors = vErrors;
return false;
}
else {
errors = _errs0;
if(vErrors !== null){
if(_errs0){
vErrors.length = _errs0;
}
else {
vErrors = null;
}
}
}
validate24.errors = vErrors;
evaluated0.props = props1;
return errors === 0;
}
validate24.evaluated = {"dynamicProps":true,"dynamicItems":false};


function validate75(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate75.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((((((data.profileVersion === undefined) || (!(func0.call(data, "profileVersion")))) && (missing0 = "profileVersion")) || (((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing0 = "kind"))) || (((data.id === undefined) || (!(func0.call(data, "id")))) && (missing0 = "id"))) || (((data.kitVersion === undefined) || (!(func0.call(data, "kitVersion")))) && (missing0 = "kitVersion"))) || (((data.title === undefined) || (!(func0.call(data, "title")))) && (missing0 = "title"))) || (((data.method === undefined) || (!(func0.call(data, "method")))) && (missing0 = "method"))) || (((data.evidenceSlots === undefined) || (!(func0.call(data, "evidenceSlots")))) && (missing0 = "evidenceSlots"))) || (((data.criteria === undefined) || (!(func0.call(data, "criteria")))) && (missing0 = "criteria"))) || (((data.weightOrders === undefined) || (!(func0.call(data, "weightOrders")))) && (missing0 = "weightOrders"))) || (((data.limits === undefined) || (!(func0.call(data, "limits")))) && (missing0 = "limits"))) || (((data.recommendation === undefined) || (!(func0.call(data, "recommendation")))) && (missing0 = "recommendation"))){
validate75.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!(func0.call(schema32.properties, key0))){
validate75.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.profileVersion !== undefined && func0.call(data, "profileVersion")){
const _errs2 = errors;
if("comparison/0.1.0-draft.1" !== data.profileVersion){
validate75.errors = [{instancePath:instancePath+"/profileVersion",schemaPath:"#/$defs/version/const",keyword:"const",params:{allowedValue: "comparison/0.1.0-draft.1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.kind !== undefined && func0.call(data, "kind")){
const _errs4 = errors;
if("comparison-kit" !== data.kind){
validate75.errors = [{instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "comparison-kit"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined && func0.call(data, "id")){
let data2 = data.id;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern4.test(data2)){
validate75.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate75.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.kitVersion !== undefined && func0.call(data, "kitVersion")){
let data3 = data.kitVersion;
const _errs8 = errors;
const _errs9 = errors;
if(errors === _errs9){
if(typeof data3 === "string"){
if(!pattern4.test(data3)){
validate75.errors = [{instancePath:instancePath+"/kitVersion",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate75.errors = [{instancePath:instancePath+"/kitVersion",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.title !== undefined && func0.call(data, "title")){
let data4 = data.title;
const _errs11 = errors;
const _errs12 = errors;
if(errors === _errs12){
if(typeof data4 === "string"){
if(!pattern6.test(data4)){
validate75.errors = [{instancePath:instancePath+"/title",schemaPath:"#/$defs/text/pattern",keyword:"pattern",params:{pattern: "^[\\s\\S]{1,2000}$"},message:"must match pattern \""+"^[\\s\\S]{1,2000}$"+"\""}];
return false;
}
}
else {
validate75.errors = [{instancePath:instancePath+"/title",schemaPath:"#/$defs/text/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.method !== undefined && func0.call(data, "method")){
const _errs14 = errors;
if("smaa-weighted-sum-v1" !== data.method){
validate75.errors = [{instancePath:instancePath+"/method",schemaPath:"#/$defs/method/const",keyword:"const",params:{allowedValue: "smaa-weighted-sum-v1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.evidenceSlots !== undefined && func0.call(data, "evidenceSlots")){
let data6 = data.evidenceSlots;
const _errs16 = errors;
if(errors === _errs16){
if(Array.isArray(data6)){
if(data6.length > 32){
validate75.errors = [{instancePath:instancePath+"/evidenceSlots",schemaPath:"#/properties/evidenceSlots/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"}];
return false;
}
else {
if(data6.length < 1){
validate75.errors = [{instancePath:instancePath+"/evidenceSlots",schemaPath:"#/properties/evidenceSlots/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid6 = true;
const len0 = data6.length;
for(let i0=0; i0<len0; i0++){
const _errs18 = errors;
if(!(validate22(data6[i0], {instancePath:instancePath+"/evidenceSlots/" + i0,parentData:data6,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
errors = vErrors.length;
}
var valid6 = _errs18 === errors;
if(!valid6){
break;
}
}
}
}
}
else {
validate75.errors = [{instancePath:instancePath+"/evidenceSlots",schemaPath:"#/properties/evidenceSlots/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.criteria !== undefined && func0.call(data, "criteria")){
let data8 = data.criteria;
const _errs19 = errors;
if(errors === _errs19){
if(Array.isArray(data8)){
if(data8.length > 32){
validate75.errors = [{instancePath:instancePath+"/criteria",schemaPath:"#/properties/criteria/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"}];
return false;
}
else {
if(data8.length < 1){
validate75.errors = [{instancePath:instancePath+"/criteria",schemaPath:"#/properties/criteria/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid7 = true;
const len1 = data8.length;
for(let i1=0; i1<len1; i1++){
const _errs21 = errors;
if(!(validate24(data8[i1], {instancePath:instancePath+"/criteria/" + i1,parentData:data8,parentDataProperty:i1,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate24.errors : vErrors.concat(validate24.errors);
errors = vErrors.length;
}
var valid7 = _errs21 === errors;
if(!valid7){
break;
}
}
}
}
}
else {
validate75.errors = [{instancePath:instancePath+"/criteria",schemaPath:"#/properties/criteria/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs19 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.weightOrders !== undefined && func0.call(data, "weightOrders")){
let data10 = data.weightOrders;
const _errs22 = errors;
if(errors === _errs22){
if(Array.isArray(data10)){
if(data10.length > 64){
validate75.errors = [{instancePath:instancePath+"/weightOrders",schemaPath:"#/properties/weightOrders/maxItems",keyword:"maxItems",params:{limit: 64},message:"must NOT have more than 64 items"}];
return false;
}
else {
if(data10.length < 0){
validate75.errors = [{instancePath:instancePath+"/weightOrders",schemaPath:"#/properties/weightOrders/minItems",keyword:"minItems",params:{limit: 0},message:"must NOT have fewer than 0 items"}];
return false;
}
else {
var valid8 = true;
const len2 = data10.length;
for(let i2=0; i2<len2; i2++){
let data11 = data10[i2];
const _errs24 = errors;
if(errors === _errs24){
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
let missing1;
if((((data11.higher === undefined) || (!(func0.call(data11, "higher")))) && (missing1 = "higher")) || (((data11.lower === undefined) || (!(func0.call(data11, "lower")))) && (missing1 = "lower"))){
validate75.errors = [{instancePath:instancePath+"/weightOrders/" + i2,schemaPath:"#/properties/weightOrders/items/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs26 = errors;
for(const key1 of Object.keys(data11)){
if(!((key1 === "higher") || (key1 === "lower"))){
validate75.errors = [{instancePath:instancePath+"/weightOrders/" + i2,schemaPath:"#/properties/weightOrders/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs26 === errors){
if(data11.higher !== undefined && func0.call(data11, "higher")){
let data12 = data11.higher;
const _errs27 = errors;
const _errs28 = errors;
if(errors === _errs28){
if(typeof data12 === "string"){
if(!pattern4.test(data12)){
validate75.errors = [{instancePath:instancePath+"/weightOrders/" + i2+"/higher",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate75.errors = [{instancePath:instancePath+"/weightOrders/" + i2+"/higher",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid9 = _errs27 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data11.lower !== undefined && func0.call(data11, "lower")){
let data13 = data11.lower;
const _errs30 = errors;
const _errs31 = errors;
if(errors === _errs31){
if(typeof data13 === "string"){
if(!pattern4.test(data13)){
validate75.errors = [{instancePath:instancePath+"/weightOrders/" + i2+"/lower",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate75.errors = [{instancePath:instancePath+"/weightOrders/" + i2+"/lower",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid9 = _errs30 === errors;
}
else {
var valid9 = true;
}
}
}
}
}
else {
validate75.errors = [{instancePath:instancePath+"/weightOrders/" + i2,schemaPath:"#/properties/weightOrders/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid8 = _errs24 === errors;
if(!valid8){
break;
}
}
}
}
}
else {
validate75.errors = [{instancePath:instancePath+"/weightOrders",schemaPath:"#/properties/weightOrders/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs22 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.limits !== undefined && func0.call(data, "limits")){
let data14 = data.limits;
const _errs33 = errors;
if(errors === _errs33){
if(data14 && typeof data14 == "object" && !Array.isArray(data14)){
let missing2;
if((((((data14.maxOptions === undefined) || (!(func0.call(data14, "maxOptions")))) && (missing2 = "maxOptions")) || (((data14.maxSamples === undefined) || (!(func0.call(data14, "maxSamples")))) && (missing2 = "maxSamples"))) || (((data14.maxExactScenarios === undefined) || (!(func0.call(data14, "maxExactScenarios")))) && (missing2 = "maxExactScenarios"))) || (((data14.maxWork === undefined) || (!(func0.call(data14, "maxWork")))) && (missing2 = "maxWork"))){
validate75.errors = [{instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
const _errs35 = errors;
for(const key2 of Object.keys(data14)){
if(!((((key2 === "maxOptions") || (key2 === "maxSamples")) || (key2 === "maxExactScenarios")) || (key2 === "maxWork"))){
validate75.errors = [{instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs35 === errors){
if(data14.maxOptions !== undefined && func0.call(data14, "maxOptions")){
let data15 = data14.maxOptions;
const _errs36 = errors;
if(!(((typeof data15 == "number") && (!(data15 % 1) && !isNaN(data15))) && (isFinite(data15)))){
validate75.errors = [{instancePath:instancePath+"/limits/maxOptions",schemaPath:"#/properties/limits/properties/maxOptions/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs36){
if((typeof data15 == "number") && (isFinite(data15))){
if(data15 > 32 || isNaN(data15)){
validate75.errors = [{instancePath:instancePath+"/limits/maxOptions",schemaPath:"#/properties/limits/properties/maxOptions/maximum",keyword:"maximum",params:{comparison: "<=", limit: 32},message:"must be <= 32"}];
return false;
}
else {
if(data15 < 2 || isNaN(data15)){
validate75.errors = [{instancePath:instancePath+"/limits/maxOptions",schemaPath:"#/properties/limits/properties/maxOptions/minimum",keyword:"minimum",params:{comparison: ">=", limit: 2},message:"must be >= 2"}];
return false;
}
}
}
}
var valid12 = _errs36 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data14.maxSamples !== undefined && func0.call(data14, "maxSamples")){
let data16 = data14.maxSamples;
const _errs38 = errors;
if(!(((typeof data16 == "number") && (!(data16 % 1) && !isNaN(data16))) && (isFinite(data16)))){
validate75.errors = [{instancePath:instancePath+"/limits/maxSamples",schemaPath:"#/properties/limits/properties/maxSamples/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs38){
if((typeof data16 == "number") && (isFinite(data16))){
if(data16 > 100000 || isNaN(data16)){
validate75.errors = [{instancePath:instancePath+"/limits/maxSamples",schemaPath:"#/properties/limits/properties/maxSamples/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100000},message:"must be <= 100000"}];
return false;
}
else {
if(data16 < 100 || isNaN(data16)){
validate75.errors = [{instancePath:instancePath+"/limits/maxSamples",schemaPath:"#/properties/limits/properties/maxSamples/minimum",keyword:"minimum",params:{comparison: ">=", limit: 100},message:"must be >= 100"}];
return false;
}
}
}
}
var valid12 = _errs38 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data14.maxExactScenarios !== undefined && func0.call(data14, "maxExactScenarios")){
let data17 = data14.maxExactScenarios;
const _errs40 = errors;
if(!(((typeof data17 == "number") && (!(data17 % 1) && !isNaN(data17))) && (isFinite(data17)))){
validate75.errors = [{instancePath:instancePath+"/limits/maxExactScenarios",schemaPath:"#/properties/limits/properties/maxExactScenarios/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs40){
if((typeof data17 == "number") && (isFinite(data17))){
if(data17 > 10000 || isNaN(data17)){
validate75.errors = [{instancePath:instancePath+"/limits/maxExactScenarios",schemaPath:"#/properties/limits/properties/maxExactScenarios/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"}];
return false;
}
else {
if(data17 < 1 || isNaN(data17)){
validate75.errors = [{instancePath:instancePath+"/limits/maxExactScenarios",schemaPath:"#/properties/limits/properties/maxExactScenarios/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid12 = _errs40 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data14.maxWork !== undefined && func0.call(data14, "maxWork")){
let data18 = data14.maxWork;
const _errs42 = errors;
if(!(((typeof data18 == "number") && (!(data18 % 1) && !isNaN(data18))) && (isFinite(data18)))){
validate75.errors = [{instancePath:instancePath+"/limits/maxWork",schemaPath:"#/properties/limits/properties/maxWork/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs42){
if((typeof data18 == "number") && (isFinite(data18))){
if(data18 > 20000000 || isNaN(data18)){
validate75.errors = [{instancePath:instancePath+"/limits/maxWork",schemaPath:"#/properties/limits/properties/maxWork/maximum",keyword:"maximum",params:{comparison: "<=", limit: 20000000},message:"must be <= 20000000"}];
return false;
}
else {
if(data18 < 1 || isNaN(data18)){
validate75.errors = [{instancePath:instancePath+"/limits/maxWork",schemaPath:"#/properties/limits/properties/maxWork/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid12 = _errs42 === errors;
}
else {
var valid12 = true;
}
}
}
}
}
}
}
else {
validate75.errors = [{instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs33 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.recommendation !== undefined && func0.call(data, "recommendation")){
let data19 = data.recommendation;
const _errs44 = errors;
if(errors === _errs44){
if(data19 && typeof data19 == "object" && !Array.isArray(data19)){
let missing3;
if((((((data19.minSoleFirstPpm === undefined) || (!(func0.call(data19, "minSoleFirstPpm")))) && (missing3 = "minSoleFirstPpm")) || (((data19.minLeadPpm === undefined) || (!(func0.call(data19, "minLeadPpm")))) && (missing3 = "minLeadPpm"))) || (((data19.maxExpectedRegretBp === undefined) || (!(func0.call(data19, "maxExpectedRegretBp")))) && (missing3 = "maxExpectedRegretBp"))) || (((data19.requireValidatedModels === undefined) || (!(func0.call(data19, "requireValidatedModels")))) && (missing3 = "requireValidatedModels"))){
validate75.errors = [{instancePath:instancePath+"/recommendation",schemaPath:"#/properties/recommendation/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];
return false;
}
else {
const _errs46 = errors;
for(const key3 of Object.keys(data19)){
if(!((((key3 === "minSoleFirstPpm") || (key3 === "minLeadPpm")) || (key3 === "maxExpectedRegretBp")) || (key3 === "requireValidatedModels"))){
validate75.errors = [{instancePath:instancePath+"/recommendation",schemaPath:"#/properties/recommendation/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs46 === errors){
if(data19.minSoleFirstPpm !== undefined && func0.call(data19, "minSoleFirstPpm")){
let data20 = data19.minSoleFirstPpm;
const _errs47 = errors;
if(!(((typeof data20 == "number") && (!(data20 % 1) && !isNaN(data20))) && (isFinite(data20)))){
validate75.errors = [{instancePath:instancePath+"/recommendation/minSoleFirstPpm",schemaPath:"#/properties/recommendation/properties/minSoleFirstPpm/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs47){
if((typeof data20 == "number") && (isFinite(data20))){
if(data20 > 1000000 || isNaN(data20)){
validate75.errors = [{instancePath:instancePath+"/recommendation/minSoleFirstPpm",schemaPath:"#/properties/recommendation/properties/minSoleFirstPpm/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000},message:"must be <= 1000000"}];
return false;
}
else {
if(data20 < 500001 || isNaN(data20)){
validate75.errors = [{instancePath:instancePath+"/recommendation/minSoleFirstPpm",schemaPath:"#/properties/recommendation/properties/minSoleFirstPpm/minimum",keyword:"minimum",params:{comparison: ">=", limit: 500001},message:"must be >= 500001"}];
return false;
}
}
}
}
var valid13 = _errs47 === errors;
}
else {
var valid13 = true;
}
if(valid13){
if(data19.minLeadPpm !== undefined && func0.call(data19, "minLeadPpm")){
let data21 = data19.minLeadPpm;
const _errs49 = errors;
if(!(((typeof data21 == "number") && (!(data21 % 1) && !isNaN(data21))) && (isFinite(data21)))){
validate75.errors = [{instancePath:instancePath+"/recommendation/minLeadPpm",schemaPath:"#/properties/recommendation/properties/minLeadPpm/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs49){
if((typeof data21 == "number") && (isFinite(data21))){
if(data21 > 1000000 || isNaN(data21)){
validate75.errors = [{instancePath:instancePath+"/recommendation/minLeadPpm",schemaPath:"#/properties/recommendation/properties/minLeadPpm/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000},message:"must be <= 1000000"}];
return false;
}
else {
if(data21 < 1 || isNaN(data21)){
validate75.errors = [{instancePath:instancePath+"/recommendation/minLeadPpm",schemaPath:"#/properties/recommendation/properties/minLeadPpm/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid13 = _errs49 === errors;
}
else {
var valid13 = true;
}
if(valid13){
if(data19.maxExpectedRegretBp !== undefined && func0.call(data19, "maxExpectedRegretBp")){
let data22 = data19.maxExpectedRegretBp;
const _errs51 = errors;
const _errs52 = errors;
if(!(((typeof data22 == "number") && (!(data22 % 1) && !isNaN(data22))) && (isFinite(data22)))){
validate75.errors = [{instancePath:instancePath+"/recommendation/maxExpectedRegretBp",schemaPath:"#/$defs/bp/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs52){
if((typeof data22 == "number") && (isFinite(data22))){
if(data22 > 10000 || isNaN(data22)){
validate75.errors = [{instancePath:instancePath+"/recommendation/maxExpectedRegretBp",schemaPath:"#/$defs/bp/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"}];
return false;
}
else {
if(data22 < 0 || isNaN(data22)){
validate75.errors = [{instancePath:instancePath+"/recommendation/maxExpectedRegretBp",schemaPath:"#/$defs/bp/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid13 = _errs51 === errors;
}
else {
var valid13 = true;
}
if(valid13){
if(data19.requireValidatedModels !== undefined && func0.call(data19, "requireValidatedModels")){
const _errs54 = errors;
if(true !== data19.requireValidatedModels){
validate75.errors = [{instancePath:instancePath+"/recommendation/requireValidatedModels",schemaPath:"#/properties/recommendation/properties/requireValidatedModels/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid13 = _errs54 === errors;
}
else {
var valid13 = true;
}
}
}
}
}
}
}
else {
validate75.errors = [{instancePath:instancePath+"/recommendation",schemaPath:"#/properties/recommendation/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs44 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate75.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate75.errors = vErrors;
return errors === 0;
}
validate75.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const context = validate78;
const schema67 = {"type":"object","additionalProperties":false,"required":["profileVersion","kind","id","kitDigest","options"],"properties":{"profileVersion":{"$ref":"#/$defs/version"},"kind":{"const":"evaluation-context"},"id":{"$ref":"#/$defs/id"},"kitDigest":{"$ref":"#/$defs/digest"},"options":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["id","label","evidence"],"properties":{"id":{"$ref":"#/$defs/id"},"label":{"$ref":"#/$defs/text"},"evidence":{"type":"array","items":{"$ref":"#/$defs/evidence"},"minItems":1,"maxItems":32}}},"minItems":2,"maxItems":32}}};
const schema73 = {"type":"object","additionalProperties":false,"required":["slotId","digest"],"properties":{"slotId":{"$ref":"#/$defs/id"},"digest":{"$ref":"#/$defs/digest"}}};

function validate33(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate33.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.slotId === undefined) || (!(func0.call(data, "slotId")))) && (missing0 = "slotId")) || (((data.digest === undefined) || (!(func0.call(data, "digest")))) && (missing0 = "digest"))){
validate33.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!((key0 === "slotId") || (key0 === "digest"))){
validate33.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.slotId !== undefined && func0.call(data, "slotId")){
let data0 = data.slotId;
const _errs2 = errors;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
validate33.errors = [{instancePath:instancePath+"/slotId",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate33.errors = [{instancePath:instancePath+"/slotId",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.digest !== undefined && func0.call(data, "digest")){
let data1 = data.digest;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data1 === "string"){
if(!pattern17.test(data1)){
validate33.errors = [{instancePath:instancePath+"/digest",schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate33.errors = [{instancePath:instancePath+"/digest",schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate33.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate33.errors = vErrors;
return errors === 0;
}
validate33.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate78(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate78.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.profileVersion === undefined) || (!(func0.call(data, "profileVersion")))) && (missing0 = "profileVersion")) || (((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing0 = "kind"))) || (((data.id === undefined) || (!(func0.call(data, "id")))) && (missing0 = "id"))) || (((data.kitDigest === undefined) || (!(func0.call(data, "kitDigest")))) && (missing0 = "kitDigest"))) || (((data.options === undefined) || (!(func0.call(data, "options")))) && (missing0 = "options"))){
validate78.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!(((((key0 === "profileVersion") || (key0 === "kind")) || (key0 === "id")) || (key0 === "kitDigest")) || (key0 === "options"))){
validate78.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.profileVersion !== undefined && func0.call(data, "profileVersion")){
const _errs2 = errors;
if("comparison/0.1.0-draft.1" !== data.profileVersion){
validate78.errors = [{instancePath:instancePath+"/profileVersion",schemaPath:"#/$defs/version/const",keyword:"const",params:{allowedValue: "comparison/0.1.0-draft.1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.kind !== undefined && func0.call(data, "kind")){
const _errs4 = errors;
if("evaluation-context" !== data.kind){
validate78.errors = [{instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "evaluation-context"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined && func0.call(data, "id")){
let data2 = data.id;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern4.test(data2)){
validate78.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.kitDigest !== undefined && func0.call(data, "kitDigest")){
let data3 = data.kitDigest;
const _errs8 = errors;
const _errs9 = errors;
if(errors === _errs9){
if(typeof data3 === "string"){
if(!pattern17.test(data3)){
validate78.errors = [{instancePath:instancePath+"/kitDigest",schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/kitDigest",schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.options !== undefined && func0.call(data, "options")){
let data4 = data.options;
const _errs11 = errors;
if(errors === _errs11){
if(Array.isArray(data4)){
if(data4.length > 32){
validate78.errors = [{instancePath:instancePath+"/options",schemaPath:"#/properties/options/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"}];
return false;
}
else {
if(data4.length < 2){
validate78.errors = [{instancePath:instancePath+"/options",schemaPath:"#/properties/options/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"}];
return false;
}
else {
var valid4 = true;
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
let data5 = data4[i0];
const _errs13 = errors;
if(errors === _errs13){
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
let missing1;
if(((((data5.id === undefined) || (!(func0.call(data5, "id")))) && (missing1 = "id")) || (((data5.label === undefined) || (!(func0.call(data5, "label")))) && (missing1 = "label"))) || (((data5.evidence === undefined) || (!(func0.call(data5, "evidence")))) && (missing1 = "evidence"))){
validate78.errors = [{instancePath:instancePath+"/options/" + i0,schemaPath:"#/properties/options/items/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs15 = errors;
for(const key1 of Object.keys(data5)){
if(!(((key1 === "id") || (key1 === "label")) || (key1 === "evidence"))){
validate78.errors = [{instancePath:instancePath+"/options/" + i0,schemaPath:"#/properties/options/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs15 === errors){
if(data5.id !== undefined && func0.call(data5, "id")){
let data6 = data5.id;
const _errs16 = errors;
const _errs17 = errors;
if(errors === _errs17){
if(typeof data6 === "string"){
if(!pattern4.test(data6)){
validate78.errors = [{instancePath:instancePath+"/options/" + i0+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/options/" + i0+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid5 = _errs16 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data5.label !== undefined && func0.call(data5, "label")){
let data7 = data5.label;
const _errs19 = errors;
const _errs20 = errors;
if(errors === _errs20){
if(typeof data7 === "string"){
if(!pattern6.test(data7)){
validate78.errors = [{instancePath:instancePath+"/options/" + i0+"/label",schemaPath:"#/$defs/text/pattern",keyword:"pattern",params:{pattern: "^[\\s\\S]{1,2000}$"},message:"must match pattern \""+"^[\\s\\S]{1,2000}$"+"\""}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/options/" + i0+"/label",schemaPath:"#/$defs/text/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid5 = _errs19 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data5.evidence !== undefined && func0.call(data5, "evidence")){
let data8 = data5.evidence;
const _errs22 = errors;
if(errors === _errs22){
if(Array.isArray(data8)){
if(data8.length > 32){
validate78.errors = [{instancePath:instancePath+"/options/" + i0+"/evidence",schemaPath:"#/properties/options/items/properties/evidence/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"}];
return false;
}
else {
if(data8.length < 1){
validate78.errors = [{instancePath:instancePath+"/options/" + i0+"/evidence",schemaPath:"#/properties/options/items/properties/evidence/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid8 = true;
const len1 = data8.length;
for(let i1=0; i1<len1; i1++){
const _errs24 = errors;
if(!(validate33(data8[i1], {instancePath:instancePath+"/options/" + i0+"/evidence/" + i1,parentData:data8,parentDataProperty:i1,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate33.errors : vErrors.concat(validate33.errors);
errors = vErrors.length;
}
var valid8 = _errs24 === errors;
if(!valid8){
break;
}
}
}
}
}
else {
validate78.errors = [{instancePath:instancePath+"/options/" + i0+"/evidence",schemaPath:"#/properties/options/items/properties/evidence/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid5 = _errs22 === errors;
}
else {
var valid5 = true;
}
}
}
}
}
}
else {
validate78.errors = [{instancePath:instancePath+"/options/" + i0,schemaPath:"#/properties/options/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid4 = _errs13 === errors;
if(!valid4){
break;
}
}
}
}
}
else {
validate78.errors = [{instancePath:instancePath+"/options",schemaPath:"#/properties/options/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate78.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate78.errors = vErrors;
return errors === 0;
}
validate78.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const assessments = validate80;
const schema76 = {"type":"object","additionalProperties":false,"required":["profileVersion","kind","contextDigest","assessments"],"properties":{"profileVersion":{"$ref":"#/$defs/version"},"kind":{"const":"assessment-set"},"contextDigest":{"$ref":"#/$defs/digest"},"assessments":{"type":"array","items":{"$ref":"#/$defs/assessment"},"minItems":1,"maxItems":1024}}};
const schema79 = {"oneOf":[{"type":"object","additionalProperties":false,"required":["optionId","criterionId","evaluator","evidence","status","outcomes","calibration"],"properties":{"optionId":{"$ref":"#/$defs/id"},"criterionId":{"$ref":"#/$defs/id"},"evaluator":{"$ref":"#/$defs/evaluator"},"evidence":{"type":"array","items":{"$ref":"#/$defs/evidence"},"minItems":1,"maxItems":32},"status":{"const":"ok"},"outcomes":{"type":"array","items":{"$ref":"#/$defs/outcome"},"minItems":1,"maxItems":32},"calibration":{"$ref":"#/$defs/calibration"},"rawOutputDigest":{"$ref":"#/$defs/digest"}}},{"type":"object","additionalProperties":false,"required":["optionId","criterionId","evaluator","evidence","status","detail"],"properties":{"optionId":{"$ref":"#/$defs/id"},"criterionId":{"$ref":"#/$defs/id"},"evaluator":{"$ref":"#/$defs/evaluator"},"evidence":{"type":"array","items":{"$ref":"#/$defs/evidence"},"minItems":1,"maxItems":32},"status":{"enum":["unavailable","error"]},"detail":{"$ref":"#/$defs/text"}}}]};
const schema82 = {"type":"object","additionalProperties":false,"required":["id","value","massPpm"],"properties":{"id":{"$ref":"#/$defs/id"},"value":{"$ref":"#/$defs/scalar"},"massPpm":{"type":"integer","minimum":1,"maximum":1000000}}};
const schema84 = {"oneOf":[{"type":"boolean"},{"type":"integer","minimum":-1000000000,"maximum":1000000000},{"$ref":"#/$defs/id"}]};

function validate41(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate41.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
let valid0 = false;
let passing0 = null;
const _errs1 = errors;
if(typeof data !== "boolean"){
const err0 = {instancePath,schemaPath:"#/oneOf/0/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
var _valid0 = _errs1 === errors;
if(_valid0){
valid0 = true;
passing0 = 0;
}
const _errs3 = errors;
if(!(((typeof data == "number") && (!(data % 1) && !isNaN(data))) && (isFinite(data)))){
const err1 = {instancePath,schemaPath:"#/oneOf/1/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(errors === _errs3){
if((typeof data == "number") && (isFinite(data))){
if(data > 1000000000 || isNaN(data)){
const err2 = {instancePath,schemaPath:"#/oneOf/1/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000000},message:"must be <= 1000000000"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
else {
if(data < -1000000000 || isNaN(data)){
const err3 = {instancePath,schemaPath:"#/oneOf/1/minimum",keyword:"minimum",params:{comparison: ">=", limit: -1000000000},message:"must be >= -1000000000"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
}
var _valid0 = _errs3 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid0 = true;
passing0 = 1;
}
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data === "string"){
if(!pattern4.test(data)){
const err4 = {instancePath,schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath,schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
var _valid0 = _errs5 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 2];
}
else {
if(_valid0){
valid0 = true;
passing0 = 2;
}
}
}
if(!valid0){
const err6 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
validate41.errors = vErrors;
return false;
}
else {
errors = _errs0;
if(vErrors !== null){
if(_errs0){
vErrors.length = _errs0;
}
else {
vErrors = null;
}
}
}
validate41.errors = vErrors;
return errors === 0;
}
validate41.evaluated = {"dynamicProps":false,"dynamicItems":false};


function validate40(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate40.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.id === undefined) || (!(func0.call(data, "id")))) && (missing0 = "id")) || (((data.value === undefined) || (!(func0.call(data, "value")))) && (missing0 = "value"))) || (((data.massPpm === undefined) || (!(func0.call(data, "massPpm")))) && (missing0 = "massPpm"))){
validate40.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!(((key0 === "id") || (key0 === "value")) || (key0 === "massPpm"))){
validate40.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined && func0.call(data, "id")){
let data0 = data.id;
const _errs2 = errors;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
validate40.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate40.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.value !== undefined && func0.call(data, "value")){
const _errs5 = errors;
if(!(validate41(data.value, {instancePath:instancePath+"/value",parentData:data,parentDataProperty:"value",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate41.errors : vErrors.concat(validate41.errors);
errors = vErrors.length;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.massPpm !== undefined && func0.call(data, "massPpm")){
let data2 = data.massPpm;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate40.errors = [{instancePath:instancePath+"/massPpm",schemaPath:"#/properties/massPpm/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 1000000 || isNaN(data2)){
validate40.errors = [{instancePath:instancePath+"/massPpm",schemaPath:"#/properties/massPpm/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000},message:"must be <= 1000000"}];
return false;
}
else {
if(data2 < 1 || isNaN(data2)){
validate40.errors = [{instancePath:instancePath+"/massPpm",schemaPath:"#/properties/massPpm/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate40.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate40.errors = vErrors;
return errors === 0;
}
validate40.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema86 = {"oneOf":[{"type":"object","additionalProperties":false,"required":["status"],"properties":{"status":{"const":"unvalidated"}}},{"type":"object","additionalProperties":false,"required":["status","reportDigest"],"properties":{"status":{"const":"validated"},"reportDigest":{"$ref":"#/$defs/digest"}}}]};

function validate44(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate44.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
let valid0 = false;
let passing0 = null;
const _errs1 = errors;
if(errors === _errs1){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.status === undefined) || (!(func0.call(data, "status")))) && (missing0 = "status")){
const err0 = {instancePath,schemaPath:"#/oneOf/0/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
const _errs3 = errors;
for(const key0 of Object.keys(data)){
if(!(key0 === "status")){
const err1 = {instancePath,schemaPath:"#/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
break;
}
}
if(_errs3 === errors){
if(data.status !== undefined && func0.call(data, "status")){
if("unvalidated" !== data.status){
const err2 = {instancePath:instancePath+"/status",schemaPath:"#/oneOf/0/properties/status/const",keyword:"const",params:{allowedValue: "unvalidated"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
}
}
}
else {
const err3 = {instancePath,schemaPath:"#/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
var _valid0 = _errs1 === errors;
if(_valid0){
valid0 = true;
passing0 = 0;
var props0 = true;
}
const _errs5 = errors;
if(errors === _errs5){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if((((data.status === undefined) || (!(func0.call(data, "status")))) && (missing1 = "status")) || (((data.reportDigest === undefined) || (!(func0.call(data, "reportDigest")))) && (missing1 = "reportDigest"))){
const err4 = {instancePath,schemaPath:"#/oneOf/1/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
else {
const _errs7 = errors;
for(const key1 of Object.keys(data)){
if(!((key1 === "status") || (key1 === "reportDigest"))){
const err5 = {instancePath,schemaPath:"#/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
break;
}
}
if(_errs7 === errors){
if(data.status !== undefined && func0.call(data, "status")){
const _errs8 = errors;
if("validated" !== data.status){
const err6 = {instancePath:instancePath+"/status",schemaPath:"#/oneOf/1/properties/status/const",keyword:"const",params:{allowedValue: "validated"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var valid2 = _errs8 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data.reportDigest !== undefined && func0.call(data, "reportDigest")){
let data2 = data.reportDigest;
const _errs9 = errors;
const _errs10 = errors;
if(errors === _errs10){
if(typeof data2 === "string"){
if(!pattern17.test(data2)){
const err7 = {instancePath:instancePath+"/reportDigest",schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
else {
const err8 = {instancePath:instancePath+"/reportDigest",schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
var valid2 = _errs9 === errors;
}
else {
var valid2 = true;
}
}
}
}
}
else {
const err9 = {instancePath,schemaPath:"#/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
var _valid0 = _errs5 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid0 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
}
if(!valid0){
const err10 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
validate44.errors = vErrors;
return false;
}
else {
errors = _errs0;
if(vErrors !== null){
if(_errs0){
vErrors.length = _errs0;
}
else {
vErrors = null;
}
}
}
validate44.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate44.evaluated = {"dynamicProps":true,"dynamicItems":false};


function validate37(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate37.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
let valid0 = false;
let passing0 = null;
const _errs1 = errors;
if(errors === _errs1){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((data.optionId === undefined) || (!(func0.call(data, "optionId")))) && (missing0 = "optionId")) || (((data.criterionId === undefined) || (!(func0.call(data, "criterionId")))) && (missing0 = "criterionId"))) || (((data.evaluator === undefined) || (!(func0.call(data, "evaluator")))) && (missing0 = "evaluator"))) || (((data.evidence === undefined) || (!(func0.call(data, "evidence")))) && (missing0 = "evidence"))) || (((data.status === undefined) || (!(func0.call(data, "status")))) && (missing0 = "status"))) || (((data.outcomes === undefined) || (!(func0.call(data, "outcomes")))) && (missing0 = "outcomes"))) || (((data.calibration === undefined) || (!(func0.call(data, "calibration")))) && (missing0 = "calibration"))){
const err0 = {instancePath,schemaPath:"#/oneOf/0/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
const _errs3 = errors;
for(const key0 of Object.keys(data)){
if(!((((((((key0 === "optionId") || (key0 === "criterionId")) || (key0 === "evaluator")) || (key0 === "evidence")) || (key0 === "status")) || (key0 === "outcomes")) || (key0 === "calibration")) || (key0 === "rawOutputDigest"))){
const err1 = {instancePath,schemaPath:"#/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
break;
}
}
if(_errs3 === errors){
if(data.optionId !== undefined && func0.call(data, "optionId")){
let data0 = data.optionId;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
const err2 = {instancePath:instancePath+"/optionId",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/optionId",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
var valid1 = _errs4 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.criterionId !== undefined && func0.call(data, "criterionId")){
let data1 = data.criterionId;
const _errs7 = errors;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data1 === "string"){
if(!pattern4.test(data1)){
const err4 = {instancePath:instancePath+"/criterionId",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/criterionId",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
var valid1 = _errs7 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.evaluator !== undefined && func0.call(data, "evaluator")){
const _errs10 = errors;
if(!(validate25(data.evaluator, {instancePath:instancePath+"/evaluator",parentData:data,parentDataProperty:"evaluator",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
errors = vErrors.length;
}
var valid1 = _errs10 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.evidence !== undefined && func0.call(data, "evidence")){
let data3 = data.evidence;
const _errs11 = errors;
if(errors === _errs11){
if(Array.isArray(data3)){
if(data3.length > 32){
const err6 = {instancePath:instancePath+"/evidence",schemaPath:"#/oneOf/0/properties/evidence/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
else {
if(data3.length < 1){
const err7 = {instancePath:instancePath+"/evidence",schemaPath:"#/oneOf/0/properties/evidence/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
else {
var valid4 = true;
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
const _errs13 = errors;
if(!(validate33(data3[i0], {instancePath:instancePath+"/evidence/" + i0,parentData:data3,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate33.errors : vErrors.concat(validate33.errors);
errors = vErrors.length;
}
var valid4 = _errs13 === errors;
if(!valid4){
break;
}
}
}
}
}
else {
const err8 = {instancePath:instancePath+"/evidence",schemaPath:"#/oneOf/0/properties/evidence/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
var valid1 = _errs11 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.status !== undefined && func0.call(data, "status")){
const _errs14 = errors;
if("ok" !== data.status){
const err9 = {instancePath:instancePath+"/status",schemaPath:"#/oneOf/0/properties/status/const",keyword:"const",params:{allowedValue: "ok"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
var valid1 = _errs14 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.outcomes !== undefined && func0.call(data, "outcomes")){
let data6 = data.outcomes;
const _errs15 = errors;
if(errors === _errs15){
if(Array.isArray(data6)){
if(data6.length > 32){
const err10 = {instancePath:instancePath+"/outcomes",schemaPath:"#/oneOf/0/properties/outcomes/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
else {
if(data6.length < 1){
const err11 = {instancePath:instancePath+"/outcomes",schemaPath:"#/oneOf/0/properties/outcomes/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
else {
var valid5 = true;
const len1 = data6.length;
for(let i1=0; i1<len1; i1++){
const _errs17 = errors;
if(!(validate40(data6[i1], {instancePath:instancePath+"/outcomes/" + i1,parentData:data6,parentDataProperty:i1,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate40.errors : vErrors.concat(validate40.errors);
errors = vErrors.length;
}
var valid5 = _errs17 === errors;
if(!valid5){
break;
}
}
}
}
}
else {
const err12 = {instancePath:instancePath+"/outcomes",schemaPath:"#/oneOf/0/properties/outcomes/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
var valid1 = _errs15 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.calibration !== undefined && func0.call(data, "calibration")){
const _errs18 = errors;
if(!(validate44(data.calibration, {instancePath:instancePath+"/calibration",parentData:data,parentDataProperty:"calibration",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate44.errors : vErrors.concat(validate44.errors);
errors = vErrors.length;
}
var valid1 = _errs18 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.rawOutputDigest !== undefined && func0.call(data, "rawOutputDigest")){
let data9 = data.rawOutputDigest;
const _errs19 = errors;
const _errs20 = errors;
if(errors === _errs20){
if(typeof data9 === "string"){
if(!pattern17.test(data9)){
const err13 = {instancePath:instancePath+"/rawOutputDigest",schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/rawOutputDigest",schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
var valid1 = _errs19 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
}
}
}
}
}
}
else {
const err15 = {instancePath,schemaPath:"#/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
var _valid0 = _errs1 === errors;
if(_valid0){
valid0 = true;
passing0 = 0;
var props2 = true;
}
const _errs22 = errors;
if(errors === _errs22){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if((((((((data.optionId === undefined) || (!(func0.call(data, "optionId")))) && (missing1 = "optionId")) || (((data.criterionId === undefined) || (!(func0.call(data, "criterionId")))) && (missing1 = "criterionId"))) || (((data.evaluator === undefined) || (!(func0.call(data, "evaluator")))) && (missing1 = "evaluator"))) || (((data.evidence === undefined) || (!(func0.call(data, "evidence")))) && (missing1 = "evidence"))) || (((data.status === undefined) || (!(func0.call(data, "status")))) && (missing1 = "status"))) || (((data.detail === undefined) || (!(func0.call(data, "detail")))) && (missing1 = "detail"))){
const err16 = {instancePath,schemaPath:"#/oneOf/1/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
else {
const _errs24 = errors;
for(const key1 of Object.keys(data)){
if(!((((((key1 === "optionId") || (key1 === "criterionId")) || (key1 === "evaluator")) || (key1 === "evidence")) || (key1 === "status")) || (key1 === "detail"))){
const err17 = {instancePath,schemaPath:"#/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
break;
}
}
if(_errs24 === errors){
if(data.optionId !== undefined && func0.call(data, "optionId")){
let data10 = data.optionId;
const _errs25 = errors;
const _errs26 = errors;
if(errors === _errs26){
if(typeof data10 === "string"){
if(!pattern4.test(data10)){
const err18 = {instancePath:instancePath+"/optionId",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/optionId",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
var valid7 = _errs25 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data.criterionId !== undefined && func0.call(data, "criterionId")){
let data11 = data.criterionId;
const _errs28 = errors;
const _errs29 = errors;
if(errors === _errs29){
if(typeof data11 === "string"){
if(!pattern4.test(data11)){
const err20 = {instancePath:instancePath+"/criterionId",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
else {
const err21 = {instancePath:instancePath+"/criterionId",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
var valid7 = _errs28 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data.evaluator !== undefined && func0.call(data, "evaluator")){
const _errs31 = errors;
if(!(validate25(data.evaluator, {instancePath:instancePath+"/evaluator",parentData:data,parentDataProperty:"evaluator",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
errors = vErrors.length;
}
var valid7 = _errs31 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data.evidence !== undefined && func0.call(data, "evidence")){
let data13 = data.evidence;
const _errs32 = errors;
if(errors === _errs32){
if(Array.isArray(data13)){
if(data13.length > 32){
const err22 = {instancePath:instancePath+"/evidence",schemaPath:"#/oneOf/1/properties/evidence/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
else {
if(data13.length < 1){
const err23 = {instancePath:instancePath+"/evidence",schemaPath:"#/oneOf/1/properties/evidence/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
else {
var valid10 = true;
const len2 = data13.length;
for(let i2=0; i2<len2; i2++){
const _errs34 = errors;
if(!(validate33(data13[i2], {instancePath:instancePath+"/evidence/" + i2,parentData:data13,parentDataProperty:i2,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate33.errors : vErrors.concat(validate33.errors);
errors = vErrors.length;
}
var valid10 = _errs34 === errors;
if(!valid10){
break;
}
}
}
}
}
else {
const err24 = {instancePath:instancePath+"/evidence",schemaPath:"#/oneOf/1/properties/evidence/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
var valid7 = _errs32 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data.status !== undefined && func0.call(data, "status")){
let data15 = data.status;
const _errs35 = errors;
if(!((data15 === "unavailable") || (data15 === "error"))){
const err25 = {instancePath:instancePath+"/status",schemaPath:"#/oneOf/1/properties/status/enum",keyword:"enum",params:{allowedValues: schema79.oneOf[1].properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
var valid7 = _errs35 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data.detail !== undefined && func0.call(data, "detail")){
let data16 = data.detail;
const _errs36 = errors;
const _errs37 = errors;
if(errors === _errs37){
if(typeof data16 === "string"){
if(!pattern6.test(data16)){
const err26 = {instancePath:instancePath+"/detail",schemaPath:"#/$defs/text/pattern",keyword:"pattern",params:{pattern: "^[\\s\\S]{1,2000}$"},message:"must match pattern \""+"^[\\s\\S]{1,2000}$"+"\""};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
else {
const err27 = {instancePath:instancePath+"/detail",schemaPath:"#/$defs/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
var valid7 = _errs36 === errors;
}
else {
var valid7 = true;
}
}
}
}
}
}
}
}
}
else {
const err28 = {instancePath,schemaPath:"#/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
var _valid0 = _errs22 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid0 = true;
passing0 = 1;
if(props2 !== true){
props2 = true;
}
}
}
if(!valid0){
const err29 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
validate37.errors = vErrors;
return false;
}
else {
errors = _errs0;
if(vErrors !== null){
if(_errs0){
vErrors.length = _errs0;
}
else {
vErrors = null;
}
}
}
validate37.errors = vErrors;
evaluated0.props = props2;
return errors === 0;
}
validate37.evaluated = {"dynamicProps":true,"dynamicItems":false};


function validate80(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate80.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.profileVersion === undefined) || (!(func0.call(data, "profileVersion")))) && (missing0 = "profileVersion")) || (((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing0 = "kind"))) || (((data.contextDigest === undefined) || (!(func0.call(data, "contextDigest")))) && (missing0 = "contextDigest"))) || (((data.assessments === undefined) || (!(func0.call(data, "assessments")))) && (missing0 = "assessments"))){
validate80.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!((((key0 === "profileVersion") || (key0 === "kind")) || (key0 === "contextDigest")) || (key0 === "assessments"))){
validate80.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.profileVersion !== undefined && func0.call(data, "profileVersion")){
const _errs2 = errors;
if("comparison/0.1.0-draft.1" !== data.profileVersion){
validate80.errors = [{instancePath:instancePath+"/profileVersion",schemaPath:"#/$defs/version/const",keyword:"const",params:{allowedValue: "comparison/0.1.0-draft.1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.kind !== undefined && func0.call(data, "kind")){
const _errs4 = errors;
if("assessment-set" !== data.kind){
validate80.errors = [{instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "assessment-set"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contextDigest !== undefined && func0.call(data, "contextDigest")){
let data2 = data.contextDigest;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern17.test(data2)){
validate80.errors = [{instancePath:instancePath+"/contextDigest",schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate80.errors = [{instancePath:instancePath+"/contextDigest",schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.assessments !== undefined && func0.call(data, "assessments")){
let data3 = data.assessments;
const _errs8 = errors;
if(errors === _errs8){
if(Array.isArray(data3)){
if(data3.length > 1024){
validate80.errors = [{instancePath:instancePath+"/assessments",schemaPath:"#/properties/assessments/maxItems",keyword:"maxItems",params:{limit: 1024},message:"must NOT have more than 1024 items"}];
return false;
}
else {
if(data3.length < 1){
validate80.errors = [{instancePath:instancePath+"/assessments",schemaPath:"#/properties/assessments/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid3 = true;
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
const _errs10 = errors;
if(!(validate37(data3[i0], {instancePath:instancePath+"/assessments/" + i0,parentData:data3,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate37.errors : vErrors.concat(validate37.errors);
errors = vErrors.length;
}
var valid3 = _errs10 === errors;
if(!valid3){
break;
}
}
}
}
}
else {
validate80.errors = [{instancePath:instancePath+"/assessments",schemaPath:"#/properties/assessments/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate80.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate80.errors = vErrors;
return errors === 0;
}
validate80.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const request = validate82;
const schema92 = {"type":"object","additionalProperties":false,"required":["profileVersion","kind","id","contextDigest","assessmentDigest","weights","dependence","computation"],"properties":{"profileVersion":{"$ref":"#/$defs/version"},"kind":{"const":"comparison-request"},"id":{"$ref":"#/$defs/id"},"contextDigest":{"$ref":"#/$defs/digest"},"assessmentDigest":{"$ref":"#/$defs/digest"},"weights":{"type":"array","items":{"$ref":"#/$defs/weightScenario"},"minItems":1,"maxItems":64},"dependence":{"$ref":"#/$defs/dependence"},"computation":{"$ref":"#/$defs/computation"}}};
const schema112 = {"oneOf":[{"type":"object","additionalProperties":false,"required":["mode"],"properties":{"mode":{"const":"exact"}}},{"type":"object","additionalProperties":false,"required":["mode","algorithm","samples"],"properties":{"mode":{"const":"monte-carlo"},"algorithm":{"const":"xoshiro128ss-v1"},"samples":{"type":"integer","minimum":100,"maximum":100000}}}]};
const schema97 = {"type":"object","additionalProperties":false,"required":["id","massPpm","weights"],"properties":{"id":{"$ref":"#/$defs/id"},"massPpm":{"type":"integer","minimum":1,"maximum":1000000},"weights":{"type":"array","items":{"$ref":"#/$defs/weight"},"minItems":1,"maxItems":32}}};
const schema99 = {"type":"object","additionalProperties":false,"required":["criterionId","weightBp"],"properties":{"criterionId":{"$ref":"#/$defs/id"},"weightBp":{"$ref":"#/$defs/bp"}}};

function validate52(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate52.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.criterionId === undefined) || (!(func0.call(data, "criterionId")))) && (missing0 = "criterionId")) || (((data.weightBp === undefined) || (!(func0.call(data, "weightBp")))) && (missing0 = "weightBp"))){
validate52.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!((key0 === "criterionId") || (key0 === "weightBp"))){
validate52.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.criterionId !== undefined && func0.call(data, "criterionId")){
let data0 = data.criterionId;
const _errs2 = errors;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
validate52.errors = [{instancePath:instancePath+"/criterionId",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate52.errors = [{instancePath:instancePath+"/criterionId",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.weightBp !== undefined && func0.call(data, "weightBp")){
let data1 = data.weightBp;
const _errs5 = errors;
const _errs6 = errors;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
validate52.errors = [{instancePath:instancePath+"/weightBp",schemaPath:"#/$defs/bp/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 10000 || isNaN(data1)){
validate52.errors = [{instancePath:instancePath+"/weightBp",schemaPath:"#/$defs/bp/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"}];
return false;
}
else {
if(data1 < 0 || isNaN(data1)){
validate52.errors = [{instancePath:instancePath+"/weightBp",schemaPath:"#/$defs/bp/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate52.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate52.errors = vErrors;
return errors === 0;
}
validate52.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate51(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate51.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.id === undefined) || (!(func0.call(data, "id")))) && (missing0 = "id")) || (((data.massPpm === undefined) || (!(func0.call(data, "massPpm")))) && (missing0 = "massPpm"))) || (((data.weights === undefined) || (!(func0.call(data, "weights")))) && (missing0 = "weights"))){
validate51.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!(((key0 === "id") || (key0 === "massPpm")) || (key0 === "weights"))){
validate51.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined && func0.call(data, "id")){
let data0 = data.id;
const _errs2 = errors;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
validate51.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate51.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.massPpm !== undefined && func0.call(data, "massPpm")){
let data1 = data.massPpm;
const _errs5 = errors;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
validate51.errors = [{instancePath:instancePath+"/massPpm",schemaPath:"#/properties/massPpm/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs5){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 1000000 || isNaN(data1)){
validate51.errors = [{instancePath:instancePath+"/massPpm",schemaPath:"#/properties/massPpm/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000},message:"must be <= 1000000"}];
return false;
}
else {
if(data1 < 1 || isNaN(data1)){
validate51.errors = [{instancePath:instancePath+"/massPpm",schemaPath:"#/properties/massPpm/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.weights !== undefined && func0.call(data, "weights")){
let data2 = data.weights;
const _errs7 = errors;
if(errors === _errs7){
if(Array.isArray(data2)){
if(data2.length > 32){
validate51.errors = [{instancePath:instancePath+"/weights",schemaPath:"#/properties/weights/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"}];
return false;
}
else {
if(data2.length < 1){
validate51.errors = [{instancePath:instancePath+"/weights",schemaPath:"#/properties/weights/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid2 = true;
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
const _errs9 = errors;
if(!(validate52(data2[i0], {instancePath:instancePath+"/weights/" + i0,parentData:data2,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate52.errors : vErrors.concat(validate52.errors);
errors = vErrors.length;
}
var valid2 = _errs9 === errors;
if(!valid2){
break;
}
}
}
}
}
else {
validate51.errors = [{instancePath:instancePath+"/weights",schemaPath:"#/properties/weights/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate51.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate51.errors = vErrors;
return errors === 0;
}
validate51.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema102 = {"oneOf":[{"type":"object","additionalProperties":false,"required":["kind","justification"],"properties":{"kind":{"const":"independent"},"justification":{"$ref":"#/$defs/text"}}},{"type":"object","additionalProperties":false,"required":["kind","justification","scenarios"],"properties":{"kind":{"const":"joint"},"justification":{"$ref":"#/$defs/text"},"scenarios":{"type":"array","items":{"$ref":"#/$defs/jointScenario"},"minItems":1,"maxItems":10000}}}]};
const schema105 = {"type":"object","additionalProperties":false,"required":["id","massPpm","weightScenarioId","selections"],"properties":{"id":{"$ref":"#/$defs/id"},"massPpm":{"type":"integer","minimum":1,"maximum":1000000},"weightScenarioId":{"$ref":"#/$defs/id"},"selections":{"type":"array","items":{"$ref":"#/$defs/cellSelection"},"minItems":1,"maxItems":1024}}};
const schema108 = {"type":"object","additionalProperties":false,"required":["optionId","criterionId","outcomeId"],"properties":{"optionId":{"$ref":"#/$defs/id"},"criterionId":{"$ref":"#/$defs/id"},"outcomeId":{"$ref":"#/$defs/id"}}};

function validate57(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate57.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.optionId === undefined) || (!(func0.call(data, "optionId")))) && (missing0 = "optionId")) || (((data.criterionId === undefined) || (!(func0.call(data, "criterionId")))) && (missing0 = "criterionId"))) || (((data.outcomeId === undefined) || (!(func0.call(data, "outcomeId")))) && (missing0 = "outcomeId"))){
validate57.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!(((key0 === "optionId") || (key0 === "criterionId")) || (key0 === "outcomeId"))){
validate57.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.optionId !== undefined && func0.call(data, "optionId")){
let data0 = data.optionId;
const _errs2 = errors;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
validate57.errors = [{instancePath:instancePath+"/optionId",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate57.errors = [{instancePath:instancePath+"/optionId",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.criterionId !== undefined && func0.call(data, "criterionId")){
let data1 = data.criterionId;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data1 === "string"){
if(!pattern4.test(data1)){
validate57.errors = [{instancePath:instancePath+"/criterionId",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate57.errors = [{instancePath:instancePath+"/criterionId",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.outcomeId !== undefined && func0.call(data, "outcomeId")){
let data2 = data.outcomeId;
const _errs8 = errors;
const _errs9 = errors;
if(errors === _errs9){
if(typeof data2 === "string"){
if(!pattern4.test(data2)){
validate57.errors = [{instancePath:instancePath+"/outcomeId",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate57.errors = [{instancePath:instancePath+"/outcomeId",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate57.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate57.errors = vErrors;
return errors === 0;
}
validate57.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate56(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate56.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.id === undefined) || (!(func0.call(data, "id")))) && (missing0 = "id")) || (((data.massPpm === undefined) || (!(func0.call(data, "massPpm")))) && (missing0 = "massPpm"))) || (((data.weightScenarioId === undefined) || (!(func0.call(data, "weightScenarioId")))) && (missing0 = "weightScenarioId"))) || (((data.selections === undefined) || (!(func0.call(data, "selections")))) && (missing0 = "selections"))){
validate56.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!((((key0 === "id") || (key0 === "massPpm")) || (key0 === "weightScenarioId")) || (key0 === "selections"))){
validate56.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined && func0.call(data, "id")){
let data0 = data.id;
const _errs2 = errors;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
validate56.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate56.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.massPpm !== undefined && func0.call(data, "massPpm")){
let data1 = data.massPpm;
const _errs5 = errors;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
validate56.errors = [{instancePath:instancePath+"/massPpm",schemaPath:"#/properties/massPpm/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs5){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 1000000 || isNaN(data1)){
validate56.errors = [{instancePath:instancePath+"/massPpm",schemaPath:"#/properties/massPpm/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000},message:"must be <= 1000000"}];
return false;
}
else {
if(data1 < 1 || isNaN(data1)){
validate56.errors = [{instancePath:instancePath+"/massPpm",schemaPath:"#/properties/massPpm/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.weightScenarioId !== undefined && func0.call(data, "weightScenarioId")){
let data2 = data.weightScenarioId;
const _errs7 = errors;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data2 === "string"){
if(!pattern4.test(data2)){
validate56.errors = [{instancePath:instancePath+"/weightScenarioId",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate56.errors = [{instancePath:instancePath+"/weightScenarioId",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.selections !== undefined && func0.call(data, "selections")){
let data3 = data.selections;
const _errs10 = errors;
if(errors === _errs10){
if(Array.isArray(data3)){
if(data3.length > 1024){
validate56.errors = [{instancePath:instancePath+"/selections",schemaPath:"#/properties/selections/maxItems",keyword:"maxItems",params:{limit: 1024},message:"must NOT have more than 1024 items"}];
return false;
}
else {
if(data3.length < 1){
validate56.errors = [{instancePath:instancePath+"/selections",schemaPath:"#/properties/selections/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid3 = true;
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
const _errs12 = errors;
if(!(validate57(data3[i0], {instancePath:instancePath+"/selections/" + i0,parentData:data3,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate57.errors : vErrors.concat(validate57.errors);
errors = vErrors.length;
}
var valid3 = _errs12 === errors;
if(!valid3){
break;
}
}
}
}
}
else {
validate56.errors = [{instancePath:instancePath+"/selections",schemaPath:"#/properties/selections/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate56.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate56.errors = vErrors;
return errors === 0;
}
validate56.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate55(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate55.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
let valid0 = false;
let passing0 = null;
const _errs1 = errors;
if(errors === _errs1){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing0 = "kind")) || (((data.justification === undefined) || (!(func0.call(data, "justification")))) && (missing0 = "justification"))){
const err0 = {instancePath,schemaPath:"#/oneOf/0/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
const _errs3 = errors;
for(const key0 of Object.keys(data)){
if(!((key0 === "kind") || (key0 === "justification"))){
const err1 = {instancePath,schemaPath:"#/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
break;
}
}
if(_errs3 === errors){
if(data.kind !== undefined && func0.call(data, "kind")){
const _errs4 = errors;
if("independent" !== data.kind){
const err2 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/0/properties/kind/const",keyword:"const",params:{allowedValue: "independent"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var valid1 = _errs4 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.justification !== undefined && func0.call(data, "justification")){
let data1 = data.justification;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data1 === "string"){
if(!pattern6.test(data1)){
const err3 = {instancePath:instancePath+"/justification",schemaPath:"#/$defs/text/pattern",keyword:"pattern",params:{pattern: "^[\\s\\S]{1,2000}$"},message:"must match pattern \""+"^[\\s\\S]{1,2000}$"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
else {
const err4 = {instancePath:instancePath+"/justification",schemaPath:"#/$defs/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
var valid1 = _errs5 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
else {
const err5 = {instancePath,schemaPath:"#/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
var _valid0 = _errs1 === errors;
if(_valid0){
valid0 = true;
passing0 = 0;
var props0 = true;
}
const _errs8 = errors;
if(errors === _errs8){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if(((((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing1 = "kind")) || (((data.justification === undefined) || (!(func0.call(data, "justification")))) && (missing1 = "justification"))) || (((data.scenarios === undefined) || (!(func0.call(data, "scenarios")))) && (missing1 = "scenarios"))){
const err6 = {instancePath,schemaPath:"#/oneOf/1/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
else {
const _errs10 = errors;
for(const key1 of Object.keys(data)){
if(!(((key1 === "kind") || (key1 === "justification")) || (key1 === "scenarios"))){
const err7 = {instancePath,schemaPath:"#/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
break;
}
}
if(_errs10 === errors){
if(data.kind !== undefined && func0.call(data, "kind")){
const _errs11 = errors;
if("joint" !== data.kind){
const err8 = {instancePath:instancePath+"/kind",schemaPath:"#/oneOf/1/properties/kind/const",keyword:"const",params:{allowedValue: "joint"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
var valid3 = _errs11 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data.justification !== undefined && func0.call(data, "justification")){
let data3 = data.justification;
const _errs12 = errors;
const _errs13 = errors;
if(errors === _errs13){
if(typeof data3 === "string"){
if(!pattern6.test(data3)){
const err9 = {instancePath:instancePath+"/justification",schemaPath:"#/$defs/text/pattern",keyword:"pattern",params:{pattern: "^[\\s\\S]{1,2000}$"},message:"must match pattern \""+"^[\\s\\S]{1,2000}$"+"\""};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/justification",schemaPath:"#/$defs/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
var valid3 = _errs12 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data.scenarios !== undefined && func0.call(data, "scenarios")){
let data4 = data.scenarios;
const _errs15 = errors;
if(errors === _errs15){
if(Array.isArray(data4)){
if(data4.length > 10000){
const err11 = {instancePath:instancePath+"/scenarios",schemaPath:"#/oneOf/1/properties/scenarios/maxItems",keyword:"maxItems",params:{limit: 10000},message:"must NOT have more than 10000 items"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
else {
if(data4.length < 1){
const err12 = {instancePath:instancePath+"/scenarios",schemaPath:"#/oneOf/1/properties/scenarios/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
else {
var valid5 = true;
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
const _errs17 = errors;
if(!(validate56(data4[i0], {instancePath:instancePath+"/scenarios/" + i0,parentData:data4,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate56.errors : vErrors.concat(validate56.errors);
errors = vErrors.length;
}
var valid5 = _errs17 === errors;
if(!valid5){
break;
}
}
}
}
}
else {
const err13 = {instancePath:instancePath+"/scenarios",schemaPath:"#/oneOf/1/properties/scenarios/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
var valid3 = _errs15 === errors;
}
else {
var valid3 = true;
}
}
}
}
}
}
else {
const err14 = {instancePath,schemaPath:"#/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
var _valid0 = _errs8 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid0 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
}
if(!valid0){
const err15 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
validate55.errors = vErrors;
return false;
}
else {
errors = _errs0;
if(vErrors !== null){
if(_errs0){
vErrors.length = _errs0;
}
else {
vErrors = null;
}
}
}
validate55.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate55.evaluated = {"dynamicProps":true,"dynamicItems":false};


function validate82(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate82.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((((data.profileVersion === undefined) || (!(func0.call(data, "profileVersion")))) && (missing0 = "profileVersion")) || (((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing0 = "kind"))) || (((data.id === undefined) || (!(func0.call(data, "id")))) && (missing0 = "id"))) || (((data.contextDigest === undefined) || (!(func0.call(data, "contextDigest")))) && (missing0 = "contextDigest"))) || (((data.assessmentDigest === undefined) || (!(func0.call(data, "assessmentDigest")))) && (missing0 = "assessmentDigest"))) || (((data.weights === undefined) || (!(func0.call(data, "weights")))) && (missing0 = "weights"))) || (((data.dependence === undefined) || (!(func0.call(data, "dependence")))) && (missing0 = "dependence"))) || (((data.computation === undefined) || (!(func0.call(data, "computation")))) && (missing0 = "computation"))){
validate82.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!((((((((key0 === "profileVersion") || (key0 === "kind")) || (key0 === "id")) || (key0 === "contextDigest")) || (key0 === "assessmentDigest")) || (key0 === "weights")) || (key0 === "dependence")) || (key0 === "computation"))){
validate82.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.profileVersion !== undefined && func0.call(data, "profileVersion")){
const _errs2 = errors;
if("comparison/0.1.0-draft.1" !== data.profileVersion){
validate82.errors = [{instancePath:instancePath+"/profileVersion",schemaPath:"#/$defs/version/const",keyword:"const",params:{allowedValue: "comparison/0.1.0-draft.1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.kind !== undefined && func0.call(data, "kind")){
const _errs4 = errors;
if("comparison-request" !== data.kind){
validate82.errors = [{instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "comparison-request"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined && func0.call(data, "id")){
let data2 = data.id;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern4.test(data2)){
validate82.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate82.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contextDigest !== undefined && func0.call(data, "contextDigest")){
let data3 = data.contextDigest;
const _errs8 = errors;
const _errs9 = errors;
if(errors === _errs9){
if(typeof data3 === "string"){
if(!pattern17.test(data3)){
validate82.errors = [{instancePath:instancePath+"/contextDigest",schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate82.errors = [{instancePath:instancePath+"/contextDigest",schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.assessmentDigest !== undefined && func0.call(data, "assessmentDigest")){
let data4 = data.assessmentDigest;
const _errs11 = errors;
const _errs12 = errors;
if(errors === _errs12){
if(typeof data4 === "string"){
if(!pattern17.test(data4)){
validate82.errors = [{instancePath:instancePath+"/assessmentDigest",schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate82.errors = [{instancePath:instancePath+"/assessmentDigest",schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.weights !== undefined && func0.call(data, "weights")){
let data5 = data.weights;
const _errs14 = errors;
if(errors === _errs14){
if(Array.isArray(data5)){
if(data5.length > 64){
validate82.errors = [{instancePath:instancePath+"/weights",schemaPath:"#/properties/weights/maxItems",keyword:"maxItems",params:{limit: 64},message:"must NOT have more than 64 items"}];
return false;
}
else {
if(data5.length < 1){
validate82.errors = [{instancePath:instancePath+"/weights",schemaPath:"#/properties/weights/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid5 = true;
const len0 = data5.length;
for(let i0=0; i0<len0; i0++){
const _errs16 = errors;
if(!(validate51(data5[i0], {instancePath:instancePath+"/weights/" + i0,parentData:data5,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate51.errors : vErrors.concat(validate51.errors);
errors = vErrors.length;
}
var valid5 = _errs16 === errors;
if(!valid5){
break;
}
}
}
}
}
else {
validate82.errors = [{instancePath:instancePath+"/weights",schemaPath:"#/properties/weights/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.dependence !== undefined && func0.call(data, "dependence")){
const _errs17 = errors;
if(!(validate55(data.dependence, {instancePath:instancePath+"/dependence",parentData:data,parentDataProperty:"dependence",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate55.errors : vErrors.concat(validate55.errors);
errors = vErrors.length;
}
var valid0 = _errs17 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.computation !== undefined && func0.call(data, "computation")){
let data8 = data.computation;
const _errs18 = errors;
const _errs20 = errors;
let valid7 = false;
let passing0 = null;
const _errs21 = errors;
if(errors === _errs21){
if(data8 && typeof data8 == "object" && !Array.isArray(data8)){
let missing1;
if(((data8.mode === undefined) || (!(func0.call(data8, "mode")))) && (missing1 = "mode")){
const err0 = {instancePath:instancePath+"/computation",schemaPath:"#/$defs/computation/oneOf/0/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
const _errs23 = errors;
for(const key1 of Object.keys(data8)){
if(!(key1 === "mode")){
const err1 = {instancePath:instancePath+"/computation",schemaPath:"#/$defs/computation/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
break;
}
}
if(_errs23 === errors){
if(data8.mode !== undefined && func0.call(data8, "mode")){
if("exact" !== data8.mode){
const err2 = {instancePath:instancePath+"/computation/mode",schemaPath:"#/$defs/computation/oneOf/0/properties/mode/const",keyword:"const",params:{allowedValue: "exact"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
}
}
}
else {
const err3 = {instancePath:instancePath+"/computation",schemaPath:"#/$defs/computation/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
var _valid0 = _errs21 === errors;
if(_valid0){
valid7 = true;
passing0 = 0;
var props1 = true;
}
const _errs25 = errors;
if(errors === _errs25){
if(data8 && typeof data8 == "object" && !Array.isArray(data8)){
let missing2;
if(((((data8.mode === undefined) || (!(func0.call(data8, "mode")))) && (missing2 = "mode")) || (((data8.algorithm === undefined) || (!(func0.call(data8, "algorithm")))) && (missing2 = "algorithm"))) || (((data8.samples === undefined) || (!(func0.call(data8, "samples")))) && (missing2 = "samples"))){
const err4 = {instancePath:instancePath+"/computation",schemaPath:"#/$defs/computation/oneOf/1/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
else {
const _errs27 = errors;
for(const key2 of Object.keys(data8)){
if(!(((key2 === "mode") || (key2 === "algorithm")) || (key2 === "samples"))){
const err5 = {instancePath:instancePath+"/computation",schemaPath:"#/$defs/computation/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
break;
}
}
if(_errs27 === errors){
if(data8.mode !== undefined && func0.call(data8, "mode")){
const _errs28 = errors;
if("monte-carlo" !== data8.mode){
const err6 = {instancePath:instancePath+"/computation/mode",schemaPath:"#/$defs/computation/oneOf/1/properties/mode/const",keyword:"const",params:{allowedValue: "monte-carlo"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var valid9 = _errs28 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data8.algorithm !== undefined && func0.call(data8, "algorithm")){
const _errs29 = errors;
if("xoshiro128ss-v1" !== data8.algorithm){
const err7 = {instancePath:instancePath+"/computation/algorithm",schemaPath:"#/$defs/computation/oneOf/1/properties/algorithm/const",keyword:"const",params:{allowedValue: "xoshiro128ss-v1"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
var valid9 = _errs29 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data8.samples !== undefined && func0.call(data8, "samples")){
let data12 = data8.samples;
const _errs30 = errors;
if(!(((typeof data12 == "number") && (!(data12 % 1) && !isNaN(data12))) && (isFinite(data12)))){
const err8 = {instancePath:instancePath+"/computation/samples",schemaPath:"#/$defs/computation/oneOf/1/properties/samples/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(errors === _errs30){
if((typeof data12 == "number") && (isFinite(data12))){
if(data12 > 100000 || isNaN(data12)){
const err9 = {instancePath:instancePath+"/computation/samples",schemaPath:"#/$defs/computation/oneOf/1/properties/samples/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100000},message:"must be <= 100000"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
else {
if(data12 < 100 || isNaN(data12)){
const err10 = {instancePath:instancePath+"/computation/samples",schemaPath:"#/$defs/computation/oneOf/1/properties/samples/minimum",keyword:"minimum",params:{comparison: ">=", limit: 100},message:"must be >= 100"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
}
var valid9 = _errs30 === errors;
}
else {
var valid9 = true;
}
}
}
}
}
}
else {
const err11 = {instancePath:instancePath+"/computation",schemaPath:"#/$defs/computation/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
var _valid0 = _errs25 === errors;
if(_valid0 && valid7){
valid7 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid7 = true;
passing0 = 1;
if(props1 !== true){
props1 = true;
}
}
}
if(!valid7){
const err12 = {instancePath:instancePath+"/computation",schemaPath:"#/$defs/computation/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
validate82.errors = vErrors;
return false;
}
else {
errors = _errs20;
if(vErrors !== null){
if(_errs20){
vErrors.length = _errs20;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
else {
validate82.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate82.errors = vErrors;
return errors === 0;
}
validate82.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const manifest = validate85;
const schema113 = {"type":"object","additionalProperties":false,"required":["profileVersion","kind","kitDigest","method","evidenceSlots","tasks"],"properties":{"profileVersion":{"$ref":"#/$defs/version"},"kind":{"const":"comparison-manifest"},"kitDigest":{"$ref":"#/$defs/digest"},"method":{"$ref":"#/$defs/method"},"evidenceSlots":{"type":"array","items":{"$ref":"#/$defs/evidenceSlot"},"minItems":1,"maxItems":32},"tasks":{"type":"array","items":{"$ref":"#/$defs/manifestTask"},"minItems":1,"maxItems":32}}};
const schema117 = {"type":"object","additionalProperties":false,"required":["criterionId","evaluator","scale","requiredEvidenceSlots"],"properties":{"criterionId":{"$ref":"#/$defs/id"},"evaluator":{"$ref":"#/$defs/evaluator"},"scale":{"$ref":"#/$defs/scale"},"requiredEvidenceSlots":{"type":"array","items":{"$ref":"#/$defs/id"},"minItems":1,"maxItems":16},"acceptedCalibrationDigests":{"type":"array","items":{"$ref":"#/$defs/digest"},"maxItems":16}}};

function validate64(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate64.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.criterionId === undefined) || (!(func0.call(data, "criterionId")))) && (missing0 = "criterionId")) || (((data.evaluator === undefined) || (!(func0.call(data, "evaluator")))) && (missing0 = "evaluator"))) || (((data.scale === undefined) || (!(func0.call(data, "scale")))) && (missing0 = "scale"))) || (((data.requiredEvidenceSlots === undefined) || (!(func0.call(data, "requiredEvidenceSlots")))) && (missing0 = "requiredEvidenceSlots"))){
validate64.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!(((((key0 === "criterionId") || (key0 === "evaluator")) || (key0 === "scale")) || (key0 === "requiredEvidenceSlots")) || (key0 === "acceptedCalibrationDigests"))){
validate64.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.criterionId !== undefined && func0.call(data, "criterionId")){
let data0 = data.criterionId;
const _errs2 = errors;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
validate64.errors = [{instancePath:instancePath+"/criterionId",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate64.errors = [{instancePath:instancePath+"/criterionId",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.evaluator !== undefined && func0.call(data, "evaluator")){
const _errs5 = errors;
if(!(validate25(data.evaluator, {instancePath:instancePath+"/evaluator",parentData:data,parentDataProperty:"evaluator",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
errors = vErrors.length;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.scale !== undefined && func0.call(data, "scale")){
const _errs6 = errors;
if(!(validate28(data.scale, {instancePath:instancePath+"/scale",parentData:data,parentDataProperty:"scale",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate28.errors : vErrors.concat(validate28.errors);
errors = vErrors.length;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requiredEvidenceSlots !== undefined && func0.call(data, "requiredEvidenceSlots")){
let data3 = data.requiredEvidenceSlots;
const _errs7 = errors;
if(errors === _errs7){
if(Array.isArray(data3)){
if(data3.length > 16){
validate64.errors = [{instancePath:instancePath+"/requiredEvidenceSlots",schemaPath:"#/properties/requiredEvidenceSlots/maxItems",keyword:"maxItems",params:{limit: 16},message:"must NOT have more than 16 items"}];
return false;
}
else {
if(data3.length < 1){
validate64.errors = [{instancePath:instancePath+"/requiredEvidenceSlots",schemaPath:"#/properties/requiredEvidenceSlots/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid2 = true;
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
let data4 = data3[i0];
const _errs9 = errors;
const _errs10 = errors;
if(errors === _errs10){
if(typeof data4 === "string"){
if(!pattern4.test(data4)){
validate64.errors = [{instancePath:instancePath+"/requiredEvidenceSlots/" + i0,schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate64.errors = [{instancePath:instancePath+"/requiredEvidenceSlots/" + i0,schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid2 = _errs9 === errors;
if(!valid2){
break;
}
}
}
}
}
else {
validate64.errors = [{instancePath:instancePath+"/requiredEvidenceSlots",schemaPath:"#/properties/requiredEvidenceSlots/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.acceptedCalibrationDigests !== undefined && func0.call(data, "acceptedCalibrationDigests")){
let data5 = data.acceptedCalibrationDigests;
const _errs12 = errors;
if(errors === _errs12){
if(Array.isArray(data5)){
if(data5.length > 16){
validate64.errors = [{instancePath:instancePath+"/acceptedCalibrationDigests",schemaPath:"#/properties/acceptedCalibrationDigests/maxItems",keyword:"maxItems",params:{limit: 16},message:"must NOT have more than 16 items"}];
return false;
}
else {
var valid4 = true;
const len1 = data5.length;
for(let i1=0; i1<len1; i1++){
let data6 = data5[i1];
const _errs14 = errors;
const _errs15 = errors;
if(errors === _errs15){
if(typeof data6 === "string"){
if(!pattern17.test(data6)){
validate64.errors = [{instancePath:instancePath+"/acceptedCalibrationDigests/" + i1,schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate64.errors = [{instancePath:instancePath+"/acceptedCalibrationDigests/" + i1,schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid4 = _errs14 === errors;
if(!valid4){
break;
}
}
}
}
else {
validate64.errors = [{instancePath:instancePath+"/acceptedCalibrationDigests",schemaPath:"#/properties/acceptedCalibrationDigests/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate64.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate64.errors = vErrors;
return errors === 0;
}
validate64.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate85(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate85.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.profileVersion === undefined) || (!(func0.call(data, "profileVersion")))) && (missing0 = "profileVersion")) || (((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing0 = "kind"))) || (((data.kitDigest === undefined) || (!(func0.call(data, "kitDigest")))) && (missing0 = "kitDigest"))) || (((data.method === undefined) || (!(func0.call(data, "method")))) && (missing0 = "method"))) || (((data.evidenceSlots === undefined) || (!(func0.call(data, "evidenceSlots")))) && (missing0 = "evidenceSlots"))) || (((data.tasks === undefined) || (!(func0.call(data, "tasks")))) && (missing0 = "tasks"))){
validate85.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!((((((key0 === "profileVersion") || (key0 === "kind")) || (key0 === "kitDigest")) || (key0 === "method")) || (key0 === "evidenceSlots")) || (key0 === "tasks"))){
validate85.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.profileVersion !== undefined && func0.call(data, "profileVersion")){
const _errs2 = errors;
if("comparison/0.1.0-draft.1" !== data.profileVersion){
validate85.errors = [{instancePath:instancePath+"/profileVersion",schemaPath:"#/$defs/version/const",keyword:"const",params:{allowedValue: "comparison/0.1.0-draft.1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.kind !== undefined && func0.call(data, "kind")){
const _errs4 = errors;
if("comparison-manifest" !== data.kind){
validate85.errors = [{instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "comparison-manifest"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.kitDigest !== undefined && func0.call(data, "kitDigest")){
let data2 = data.kitDigest;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern17.test(data2)){
validate85.errors = [{instancePath:instancePath+"/kitDigest",schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate85.errors = [{instancePath:instancePath+"/kitDigest",schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.method !== undefined && func0.call(data, "method")){
const _errs8 = errors;
if("smaa-weighted-sum-v1" !== data.method){
validate85.errors = [{instancePath:instancePath+"/method",schemaPath:"#/$defs/method/const",keyword:"const",params:{allowedValue: "smaa-weighted-sum-v1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.evidenceSlots !== undefined && func0.call(data, "evidenceSlots")){
let data4 = data.evidenceSlots;
const _errs10 = errors;
if(errors === _errs10){
if(Array.isArray(data4)){
if(data4.length > 32){
validate85.errors = [{instancePath:instancePath+"/evidenceSlots",schemaPath:"#/properties/evidenceSlots/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"}];
return false;
}
else {
if(data4.length < 1){
validate85.errors = [{instancePath:instancePath+"/evidenceSlots",schemaPath:"#/properties/evidenceSlots/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid4 = true;
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
const _errs12 = errors;
if(!(validate22(data4[i0], {instancePath:instancePath+"/evidenceSlots/" + i0,parentData:data4,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
errors = vErrors.length;
}
var valid4 = _errs12 === errors;
if(!valid4){
break;
}
}
}
}
}
else {
validate85.errors = [{instancePath:instancePath+"/evidenceSlots",schemaPath:"#/properties/evidenceSlots/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.tasks !== undefined && func0.call(data, "tasks")){
let data6 = data.tasks;
const _errs13 = errors;
if(errors === _errs13){
if(Array.isArray(data6)){
if(data6.length > 32){
validate85.errors = [{instancePath:instancePath+"/tasks",schemaPath:"#/properties/tasks/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"}];
return false;
}
else {
if(data6.length < 1){
validate85.errors = [{instancePath:instancePath+"/tasks",schemaPath:"#/properties/tasks/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid5 = true;
const len1 = data6.length;
for(let i1=0; i1<len1; i1++){
const _errs15 = errors;
if(!(validate64(data6[i1], {instancePath:instancePath+"/tasks/" + i1,parentData:data6,parentDataProperty:i1,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate64.errors : vErrors.concat(validate64.errors);
errors = vErrors.length;
}
var valid5 = _errs15 === errors;
if(!valid5){
break;
}
}
}
}
}
else {
validate85.errors = [{instancePath:instancePath+"/tasks",schemaPath:"#/properties/tasks/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate85.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate85.errors = vErrors;
return errors === 0;
}
validate85.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const bundle = validate88;
const schema121 = {"type":"object","additionalProperties":false,"required":["kit","context","assessments","request"],"properties":{"kit":{"$ref":"#/$defs/kit"},"context":{"$ref":"#/$defs/context"},"assessments":{"$ref":"#/$defs/assessments"},"request":{"$ref":"#/$defs/request"}}};

function validate21(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate21.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((((((data.profileVersion === undefined) || (!(func0.call(data, "profileVersion")))) && (missing0 = "profileVersion")) || (((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing0 = "kind"))) || (((data.id === undefined) || (!(func0.call(data, "id")))) && (missing0 = "id"))) || (((data.kitVersion === undefined) || (!(func0.call(data, "kitVersion")))) && (missing0 = "kitVersion"))) || (((data.title === undefined) || (!(func0.call(data, "title")))) && (missing0 = "title"))) || (((data.method === undefined) || (!(func0.call(data, "method")))) && (missing0 = "method"))) || (((data.evidenceSlots === undefined) || (!(func0.call(data, "evidenceSlots")))) && (missing0 = "evidenceSlots"))) || (((data.criteria === undefined) || (!(func0.call(data, "criteria")))) && (missing0 = "criteria"))) || (((data.weightOrders === undefined) || (!(func0.call(data, "weightOrders")))) && (missing0 = "weightOrders"))) || (((data.limits === undefined) || (!(func0.call(data, "limits")))) && (missing0 = "limits"))) || (((data.recommendation === undefined) || (!(func0.call(data, "recommendation")))) && (missing0 = "recommendation"))){
validate21.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!(func0.call(schema32.properties, key0))){
validate21.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.profileVersion !== undefined && func0.call(data, "profileVersion")){
const _errs2 = errors;
if("comparison/0.1.0-draft.1" !== data.profileVersion){
validate21.errors = [{instancePath:instancePath+"/profileVersion",schemaPath:"#/$defs/version/const",keyword:"const",params:{allowedValue: "comparison/0.1.0-draft.1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.kind !== undefined && func0.call(data, "kind")){
const _errs4 = errors;
if("comparison-kit" !== data.kind){
validate21.errors = [{instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "comparison-kit"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined && func0.call(data, "id")){
let data2 = data.id;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern4.test(data2)){
validate21.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.kitVersion !== undefined && func0.call(data, "kitVersion")){
let data3 = data.kitVersion;
const _errs8 = errors;
const _errs9 = errors;
if(errors === _errs9){
if(typeof data3 === "string"){
if(!pattern4.test(data3)){
validate21.errors = [{instancePath:instancePath+"/kitVersion",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/kitVersion",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.title !== undefined && func0.call(data, "title")){
let data4 = data.title;
const _errs11 = errors;
const _errs12 = errors;
if(errors === _errs12){
if(typeof data4 === "string"){
if(!pattern6.test(data4)){
validate21.errors = [{instancePath:instancePath+"/title",schemaPath:"#/$defs/text/pattern",keyword:"pattern",params:{pattern: "^[\\s\\S]{1,2000}$"},message:"must match pattern \""+"^[\\s\\S]{1,2000}$"+"\""}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/title",schemaPath:"#/$defs/text/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.method !== undefined && func0.call(data, "method")){
const _errs14 = errors;
if("smaa-weighted-sum-v1" !== data.method){
validate21.errors = [{instancePath:instancePath+"/method",schemaPath:"#/$defs/method/const",keyword:"const",params:{allowedValue: "smaa-weighted-sum-v1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.evidenceSlots !== undefined && func0.call(data, "evidenceSlots")){
let data6 = data.evidenceSlots;
const _errs16 = errors;
if(errors === _errs16){
if(Array.isArray(data6)){
if(data6.length > 32){
validate21.errors = [{instancePath:instancePath+"/evidenceSlots",schemaPath:"#/properties/evidenceSlots/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"}];
return false;
}
else {
if(data6.length < 1){
validate21.errors = [{instancePath:instancePath+"/evidenceSlots",schemaPath:"#/properties/evidenceSlots/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid6 = true;
const len0 = data6.length;
for(let i0=0; i0<len0; i0++){
const _errs18 = errors;
if(!(validate22(data6[i0], {instancePath:instancePath+"/evidenceSlots/" + i0,parentData:data6,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
errors = vErrors.length;
}
var valid6 = _errs18 === errors;
if(!valid6){
break;
}
}
}
}
}
else {
validate21.errors = [{instancePath:instancePath+"/evidenceSlots",schemaPath:"#/properties/evidenceSlots/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.criteria !== undefined && func0.call(data, "criteria")){
let data8 = data.criteria;
const _errs19 = errors;
if(errors === _errs19){
if(Array.isArray(data8)){
if(data8.length > 32){
validate21.errors = [{instancePath:instancePath+"/criteria",schemaPath:"#/properties/criteria/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"}];
return false;
}
else {
if(data8.length < 1){
validate21.errors = [{instancePath:instancePath+"/criteria",schemaPath:"#/properties/criteria/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid7 = true;
const len1 = data8.length;
for(let i1=0; i1<len1; i1++){
const _errs21 = errors;
if(!(validate24(data8[i1], {instancePath:instancePath+"/criteria/" + i1,parentData:data8,parentDataProperty:i1,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate24.errors : vErrors.concat(validate24.errors);
errors = vErrors.length;
}
var valid7 = _errs21 === errors;
if(!valid7){
break;
}
}
}
}
}
else {
validate21.errors = [{instancePath:instancePath+"/criteria",schemaPath:"#/properties/criteria/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs19 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.weightOrders !== undefined && func0.call(data, "weightOrders")){
let data10 = data.weightOrders;
const _errs22 = errors;
if(errors === _errs22){
if(Array.isArray(data10)){
if(data10.length > 64){
validate21.errors = [{instancePath:instancePath+"/weightOrders",schemaPath:"#/properties/weightOrders/maxItems",keyword:"maxItems",params:{limit: 64},message:"must NOT have more than 64 items"}];
return false;
}
else {
if(data10.length < 0){
validate21.errors = [{instancePath:instancePath+"/weightOrders",schemaPath:"#/properties/weightOrders/minItems",keyword:"minItems",params:{limit: 0},message:"must NOT have fewer than 0 items"}];
return false;
}
else {
var valid8 = true;
const len2 = data10.length;
for(let i2=0; i2<len2; i2++){
let data11 = data10[i2];
const _errs24 = errors;
if(errors === _errs24){
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
let missing1;
if((((data11.higher === undefined) || (!(func0.call(data11, "higher")))) && (missing1 = "higher")) || (((data11.lower === undefined) || (!(func0.call(data11, "lower")))) && (missing1 = "lower"))){
validate21.errors = [{instancePath:instancePath+"/weightOrders/" + i2,schemaPath:"#/properties/weightOrders/items/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs26 = errors;
for(const key1 of Object.keys(data11)){
if(!((key1 === "higher") || (key1 === "lower"))){
validate21.errors = [{instancePath:instancePath+"/weightOrders/" + i2,schemaPath:"#/properties/weightOrders/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs26 === errors){
if(data11.higher !== undefined && func0.call(data11, "higher")){
let data12 = data11.higher;
const _errs27 = errors;
const _errs28 = errors;
if(errors === _errs28){
if(typeof data12 === "string"){
if(!pattern4.test(data12)){
validate21.errors = [{instancePath:instancePath+"/weightOrders/" + i2+"/higher",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/weightOrders/" + i2+"/higher",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid9 = _errs27 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data11.lower !== undefined && func0.call(data11, "lower")){
let data13 = data11.lower;
const _errs30 = errors;
const _errs31 = errors;
if(errors === _errs31){
if(typeof data13 === "string"){
if(!pattern4.test(data13)){
validate21.errors = [{instancePath:instancePath+"/weightOrders/" + i2+"/lower",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/weightOrders/" + i2+"/lower",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid9 = _errs30 === errors;
}
else {
var valid9 = true;
}
}
}
}
}
else {
validate21.errors = [{instancePath:instancePath+"/weightOrders/" + i2,schemaPath:"#/properties/weightOrders/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid8 = _errs24 === errors;
if(!valid8){
break;
}
}
}
}
}
else {
validate21.errors = [{instancePath:instancePath+"/weightOrders",schemaPath:"#/properties/weightOrders/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs22 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.limits !== undefined && func0.call(data, "limits")){
let data14 = data.limits;
const _errs33 = errors;
if(errors === _errs33){
if(data14 && typeof data14 == "object" && !Array.isArray(data14)){
let missing2;
if((((((data14.maxOptions === undefined) || (!(func0.call(data14, "maxOptions")))) && (missing2 = "maxOptions")) || (((data14.maxSamples === undefined) || (!(func0.call(data14, "maxSamples")))) && (missing2 = "maxSamples"))) || (((data14.maxExactScenarios === undefined) || (!(func0.call(data14, "maxExactScenarios")))) && (missing2 = "maxExactScenarios"))) || (((data14.maxWork === undefined) || (!(func0.call(data14, "maxWork")))) && (missing2 = "maxWork"))){
validate21.errors = [{instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
const _errs35 = errors;
for(const key2 of Object.keys(data14)){
if(!((((key2 === "maxOptions") || (key2 === "maxSamples")) || (key2 === "maxExactScenarios")) || (key2 === "maxWork"))){
validate21.errors = [{instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs35 === errors){
if(data14.maxOptions !== undefined && func0.call(data14, "maxOptions")){
let data15 = data14.maxOptions;
const _errs36 = errors;
if(!(((typeof data15 == "number") && (!(data15 % 1) && !isNaN(data15))) && (isFinite(data15)))){
validate21.errors = [{instancePath:instancePath+"/limits/maxOptions",schemaPath:"#/properties/limits/properties/maxOptions/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs36){
if((typeof data15 == "number") && (isFinite(data15))){
if(data15 > 32 || isNaN(data15)){
validate21.errors = [{instancePath:instancePath+"/limits/maxOptions",schemaPath:"#/properties/limits/properties/maxOptions/maximum",keyword:"maximum",params:{comparison: "<=", limit: 32},message:"must be <= 32"}];
return false;
}
else {
if(data15 < 2 || isNaN(data15)){
validate21.errors = [{instancePath:instancePath+"/limits/maxOptions",schemaPath:"#/properties/limits/properties/maxOptions/minimum",keyword:"minimum",params:{comparison: ">=", limit: 2},message:"must be >= 2"}];
return false;
}
}
}
}
var valid12 = _errs36 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data14.maxSamples !== undefined && func0.call(data14, "maxSamples")){
let data16 = data14.maxSamples;
const _errs38 = errors;
if(!(((typeof data16 == "number") && (!(data16 % 1) && !isNaN(data16))) && (isFinite(data16)))){
validate21.errors = [{instancePath:instancePath+"/limits/maxSamples",schemaPath:"#/properties/limits/properties/maxSamples/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs38){
if((typeof data16 == "number") && (isFinite(data16))){
if(data16 > 100000 || isNaN(data16)){
validate21.errors = [{instancePath:instancePath+"/limits/maxSamples",schemaPath:"#/properties/limits/properties/maxSamples/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100000},message:"must be <= 100000"}];
return false;
}
else {
if(data16 < 100 || isNaN(data16)){
validate21.errors = [{instancePath:instancePath+"/limits/maxSamples",schemaPath:"#/properties/limits/properties/maxSamples/minimum",keyword:"minimum",params:{comparison: ">=", limit: 100},message:"must be >= 100"}];
return false;
}
}
}
}
var valid12 = _errs38 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data14.maxExactScenarios !== undefined && func0.call(data14, "maxExactScenarios")){
let data17 = data14.maxExactScenarios;
const _errs40 = errors;
if(!(((typeof data17 == "number") && (!(data17 % 1) && !isNaN(data17))) && (isFinite(data17)))){
validate21.errors = [{instancePath:instancePath+"/limits/maxExactScenarios",schemaPath:"#/properties/limits/properties/maxExactScenarios/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs40){
if((typeof data17 == "number") && (isFinite(data17))){
if(data17 > 10000 || isNaN(data17)){
validate21.errors = [{instancePath:instancePath+"/limits/maxExactScenarios",schemaPath:"#/properties/limits/properties/maxExactScenarios/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"}];
return false;
}
else {
if(data17 < 1 || isNaN(data17)){
validate21.errors = [{instancePath:instancePath+"/limits/maxExactScenarios",schemaPath:"#/properties/limits/properties/maxExactScenarios/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid12 = _errs40 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data14.maxWork !== undefined && func0.call(data14, "maxWork")){
let data18 = data14.maxWork;
const _errs42 = errors;
if(!(((typeof data18 == "number") && (!(data18 % 1) && !isNaN(data18))) && (isFinite(data18)))){
validate21.errors = [{instancePath:instancePath+"/limits/maxWork",schemaPath:"#/properties/limits/properties/maxWork/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs42){
if((typeof data18 == "number") && (isFinite(data18))){
if(data18 > 20000000 || isNaN(data18)){
validate21.errors = [{instancePath:instancePath+"/limits/maxWork",schemaPath:"#/properties/limits/properties/maxWork/maximum",keyword:"maximum",params:{comparison: "<=", limit: 20000000},message:"must be <= 20000000"}];
return false;
}
else {
if(data18 < 1 || isNaN(data18)){
validate21.errors = [{instancePath:instancePath+"/limits/maxWork",schemaPath:"#/properties/limits/properties/maxWork/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid12 = _errs42 === errors;
}
else {
var valid12 = true;
}
}
}
}
}
}
}
else {
validate21.errors = [{instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs33 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.recommendation !== undefined && func0.call(data, "recommendation")){
let data19 = data.recommendation;
const _errs44 = errors;
if(errors === _errs44){
if(data19 && typeof data19 == "object" && !Array.isArray(data19)){
let missing3;
if((((((data19.minSoleFirstPpm === undefined) || (!(func0.call(data19, "minSoleFirstPpm")))) && (missing3 = "minSoleFirstPpm")) || (((data19.minLeadPpm === undefined) || (!(func0.call(data19, "minLeadPpm")))) && (missing3 = "minLeadPpm"))) || (((data19.maxExpectedRegretBp === undefined) || (!(func0.call(data19, "maxExpectedRegretBp")))) && (missing3 = "maxExpectedRegretBp"))) || (((data19.requireValidatedModels === undefined) || (!(func0.call(data19, "requireValidatedModels")))) && (missing3 = "requireValidatedModels"))){
validate21.errors = [{instancePath:instancePath+"/recommendation",schemaPath:"#/properties/recommendation/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];
return false;
}
else {
const _errs46 = errors;
for(const key3 of Object.keys(data19)){
if(!((((key3 === "minSoleFirstPpm") || (key3 === "minLeadPpm")) || (key3 === "maxExpectedRegretBp")) || (key3 === "requireValidatedModels"))){
validate21.errors = [{instancePath:instancePath+"/recommendation",schemaPath:"#/properties/recommendation/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs46 === errors){
if(data19.minSoleFirstPpm !== undefined && func0.call(data19, "minSoleFirstPpm")){
let data20 = data19.minSoleFirstPpm;
const _errs47 = errors;
if(!(((typeof data20 == "number") && (!(data20 % 1) && !isNaN(data20))) && (isFinite(data20)))){
validate21.errors = [{instancePath:instancePath+"/recommendation/minSoleFirstPpm",schemaPath:"#/properties/recommendation/properties/minSoleFirstPpm/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs47){
if((typeof data20 == "number") && (isFinite(data20))){
if(data20 > 1000000 || isNaN(data20)){
validate21.errors = [{instancePath:instancePath+"/recommendation/minSoleFirstPpm",schemaPath:"#/properties/recommendation/properties/minSoleFirstPpm/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000},message:"must be <= 1000000"}];
return false;
}
else {
if(data20 < 500001 || isNaN(data20)){
validate21.errors = [{instancePath:instancePath+"/recommendation/minSoleFirstPpm",schemaPath:"#/properties/recommendation/properties/minSoleFirstPpm/minimum",keyword:"minimum",params:{comparison: ">=", limit: 500001},message:"must be >= 500001"}];
return false;
}
}
}
}
var valid13 = _errs47 === errors;
}
else {
var valid13 = true;
}
if(valid13){
if(data19.minLeadPpm !== undefined && func0.call(data19, "minLeadPpm")){
let data21 = data19.minLeadPpm;
const _errs49 = errors;
if(!(((typeof data21 == "number") && (!(data21 % 1) && !isNaN(data21))) && (isFinite(data21)))){
validate21.errors = [{instancePath:instancePath+"/recommendation/minLeadPpm",schemaPath:"#/properties/recommendation/properties/minLeadPpm/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs49){
if((typeof data21 == "number") && (isFinite(data21))){
if(data21 > 1000000 || isNaN(data21)){
validate21.errors = [{instancePath:instancePath+"/recommendation/minLeadPpm",schemaPath:"#/properties/recommendation/properties/minLeadPpm/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000},message:"must be <= 1000000"}];
return false;
}
else {
if(data21 < 1 || isNaN(data21)){
validate21.errors = [{instancePath:instancePath+"/recommendation/minLeadPpm",schemaPath:"#/properties/recommendation/properties/minLeadPpm/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid13 = _errs49 === errors;
}
else {
var valid13 = true;
}
if(valid13){
if(data19.maxExpectedRegretBp !== undefined && func0.call(data19, "maxExpectedRegretBp")){
let data22 = data19.maxExpectedRegretBp;
const _errs51 = errors;
const _errs52 = errors;
if(!(((typeof data22 == "number") && (!(data22 % 1) && !isNaN(data22))) && (isFinite(data22)))){
validate21.errors = [{instancePath:instancePath+"/recommendation/maxExpectedRegretBp",schemaPath:"#/$defs/bp/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs52){
if((typeof data22 == "number") && (isFinite(data22))){
if(data22 > 10000 || isNaN(data22)){
validate21.errors = [{instancePath:instancePath+"/recommendation/maxExpectedRegretBp",schemaPath:"#/$defs/bp/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"}];
return false;
}
else {
if(data22 < 0 || isNaN(data22)){
validate21.errors = [{instancePath:instancePath+"/recommendation/maxExpectedRegretBp",schemaPath:"#/$defs/bp/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid13 = _errs51 === errors;
}
else {
var valid13 = true;
}
if(valid13){
if(data19.requireValidatedModels !== undefined && func0.call(data19, "requireValidatedModels")){
const _errs54 = errors;
if(true !== data19.requireValidatedModels){
validate21.errors = [{instancePath:instancePath+"/recommendation/requireValidatedModels",schemaPath:"#/properties/recommendation/properties/requireValidatedModels/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid13 = _errs54 === errors;
}
else {
var valid13 = true;
}
}
}
}
}
}
}
else {
validate21.errors = [{instancePath:instancePath+"/recommendation",schemaPath:"#/properties/recommendation/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs44 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate21.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate21.errors = vErrors;
return errors === 0;
}
validate21.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate32(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate32.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.profileVersion === undefined) || (!(func0.call(data, "profileVersion")))) && (missing0 = "profileVersion")) || (((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing0 = "kind"))) || (((data.id === undefined) || (!(func0.call(data, "id")))) && (missing0 = "id"))) || (((data.kitDigest === undefined) || (!(func0.call(data, "kitDigest")))) && (missing0 = "kitDigest"))) || (((data.options === undefined) || (!(func0.call(data, "options")))) && (missing0 = "options"))){
validate32.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!(((((key0 === "profileVersion") || (key0 === "kind")) || (key0 === "id")) || (key0 === "kitDigest")) || (key0 === "options"))){
validate32.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.profileVersion !== undefined && func0.call(data, "profileVersion")){
const _errs2 = errors;
if("comparison/0.1.0-draft.1" !== data.profileVersion){
validate32.errors = [{instancePath:instancePath+"/profileVersion",schemaPath:"#/$defs/version/const",keyword:"const",params:{allowedValue: "comparison/0.1.0-draft.1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.kind !== undefined && func0.call(data, "kind")){
const _errs4 = errors;
if("evaluation-context" !== data.kind){
validate32.errors = [{instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "evaluation-context"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined && func0.call(data, "id")){
let data2 = data.id;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern4.test(data2)){
validate32.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate32.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.kitDigest !== undefined && func0.call(data, "kitDigest")){
let data3 = data.kitDigest;
const _errs8 = errors;
const _errs9 = errors;
if(errors === _errs9){
if(typeof data3 === "string"){
if(!pattern17.test(data3)){
validate32.errors = [{instancePath:instancePath+"/kitDigest",schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate32.errors = [{instancePath:instancePath+"/kitDigest",schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.options !== undefined && func0.call(data, "options")){
let data4 = data.options;
const _errs11 = errors;
if(errors === _errs11){
if(Array.isArray(data4)){
if(data4.length > 32){
validate32.errors = [{instancePath:instancePath+"/options",schemaPath:"#/properties/options/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"}];
return false;
}
else {
if(data4.length < 2){
validate32.errors = [{instancePath:instancePath+"/options",schemaPath:"#/properties/options/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"}];
return false;
}
else {
var valid4 = true;
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
let data5 = data4[i0];
const _errs13 = errors;
if(errors === _errs13){
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
let missing1;
if(((((data5.id === undefined) || (!(func0.call(data5, "id")))) && (missing1 = "id")) || (((data5.label === undefined) || (!(func0.call(data5, "label")))) && (missing1 = "label"))) || (((data5.evidence === undefined) || (!(func0.call(data5, "evidence")))) && (missing1 = "evidence"))){
validate32.errors = [{instancePath:instancePath+"/options/" + i0,schemaPath:"#/properties/options/items/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs15 = errors;
for(const key1 of Object.keys(data5)){
if(!(((key1 === "id") || (key1 === "label")) || (key1 === "evidence"))){
validate32.errors = [{instancePath:instancePath+"/options/" + i0,schemaPath:"#/properties/options/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs15 === errors){
if(data5.id !== undefined && func0.call(data5, "id")){
let data6 = data5.id;
const _errs16 = errors;
const _errs17 = errors;
if(errors === _errs17){
if(typeof data6 === "string"){
if(!pattern4.test(data6)){
validate32.errors = [{instancePath:instancePath+"/options/" + i0+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate32.errors = [{instancePath:instancePath+"/options/" + i0+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid5 = _errs16 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data5.label !== undefined && func0.call(data5, "label")){
let data7 = data5.label;
const _errs19 = errors;
const _errs20 = errors;
if(errors === _errs20){
if(typeof data7 === "string"){
if(!pattern6.test(data7)){
validate32.errors = [{instancePath:instancePath+"/options/" + i0+"/label",schemaPath:"#/$defs/text/pattern",keyword:"pattern",params:{pattern: "^[\\s\\S]{1,2000}$"},message:"must match pattern \""+"^[\\s\\S]{1,2000}$"+"\""}];
return false;
}
}
else {
validate32.errors = [{instancePath:instancePath+"/options/" + i0+"/label",schemaPath:"#/$defs/text/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid5 = _errs19 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data5.evidence !== undefined && func0.call(data5, "evidence")){
let data8 = data5.evidence;
const _errs22 = errors;
if(errors === _errs22){
if(Array.isArray(data8)){
if(data8.length > 32){
validate32.errors = [{instancePath:instancePath+"/options/" + i0+"/evidence",schemaPath:"#/properties/options/items/properties/evidence/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"}];
return false;
}
else {
if(data8.length < 1){
validate32.errors = [{instancePath:instancePath+"/options/" + i0+"/evidence",schemaPath:"#/properties/options/items/properties/evidence/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid8 = true;
const len1 = data8.length;
for(let i1=0; i1<len1; i1++){
const _errs24 = errors;
if(!(validate33(data8[i1], {instancePath:instancePath+"/options/" + i0+"/evidence/" + i1,parentData:data8,parentDataProperty:i1,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate33.errors : vErrors.concat(validate33.errors);
errors = vErrors.length;
}
var valid8 = _errs24 === errors;
if(!valid8){
break;
}
}
}
}
}
else {
validate32.errors = [{instancePath:instancePath+"/options/" + i0+"/evidence",schemaPath:"#/properties/options/items/properties/evidence/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid5 = _errs22 === errors;
}
else {
var valid5 = true;
}
}
}
}
}
}
else {
validate32.errors = [{instancePath:instancePath+"/options/" + i0,schemaPath:"#/properties/options/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid4 = _errs13 === errors;
if(!valid4){
break;
}
}
}
}
}
else {
validate32.errors = [{instancePath:instancePath+"/options",schemaPath:"#/properties/options/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate32.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate32.errors = vErrors;
return errors === 0;
}
validate32.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate36(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate36.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.profileVersion === undefined) || (!(func0.call(data, "profileVersion")))) && (missing0 = "profileVersion")) || (((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing0 = "kind"))) || (((data.contextDigest === undefined) || (!(func0.call(data, "contextDigest")))) && (missing0 = "contextDigest"))) || (((data.assessments === undefined) || (!(func0.call(data, "assessments")))) && (missing0 = "assessments"))){
validate36.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!((((key0 === "profileVersion") || (key0 === "kind")) || (key0 === "contextDigest")) || (key0 === "assessments"))){
validate36.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.profileVersion !== undefined && func0.call(data, "profileVersion")){
const _errs2 = errors;
if("comparison/0.1.0-draft.1" !== data.profileVersion){
validate36.errors = [{instancePath:instancePath+"/profileVersion",schemaPath:"#/$defs/version/const",keyword:"const",params:{allowedValue: "comparison/0.1.0-draft.1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.kind !== undefined && func0.call(data, "kind")){
const _errs4 = errors;
if("assessment-set" !== data.kind){
validate36.errors = [{instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "assessment-set"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contextDigest !== undefined && func0.call(data, "contextDigest")){
let data2 = data.contextDigest;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern17.test(data2)){
validate36.errors = [{instancePath:instancePath+"/contextDigest",schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate36.errors = [{instancePath:instancePath+"/contextDigest",schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.assessments !== undefined && func0.call(data, "assessments")){
let data3 = data.assessments;
const _errs8 = errors;
if(errors === _errs8){
if(Array.isArray(data3)){
if(data3.length > 1024){
validate36.errors = [{instancePath:instancePath+"/assessments",schemaPath:"#/properties/assessments/maxItems",keyword:"maxItems",params:{limit: 1024},message:"must NOT have more than 1024 items"}];
return false;
}
else {
if(data3.length < 1){
validate36.errors = [{instancePath:instancePath+"/assessments",schemaPath:"#/properties/assessments/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid3 = true;
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
const _errs10 = errors;
if(!(validate37(data3[i0], {instancePath:instancePath+"/assessments/" + i0,parentData:data3,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate37.errors : vErrors.concat(validate37.errors);
errors = vErrors.length;
}
var valid3 = _errs10 === errors;
if(!valid3){
break;
}
}
}
}
}
else {
validate36.errors = [{instancePath:instancePath+"/assessments",schemaPath:"#/properties/assessments/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate36.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate36.errors = vErrors;
return errors === 0;
}
validate36.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate50(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate50.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((((data.profileVersion === undefined) || (!(func0.call(data, "profileVersion")))) && (missing0 = "profileVersion")) || (((data.kind === undefined) || (!(func0.call(data, "kind")))) && (missing0 = "kind"))) || (((data.id === undefined) || (!(func0.call(data, "id")))) && (missing0 = "id"))) || (((data.contextDigest === undefined) || (!(func0.call(data, "contextDigest")))) && (missing0 = "contextDigest"))) || (((data.assessmentDigest === undefined) || (!(func0.call(data, "assessmentDigest")))) && (missing0 = "assessmentDigest"))) || (((data.weights === undefined) || (!(func0.call(data, "weights")))) && (missing0 = "weights"))) || (((data.dependence === undefined) || (!(func0.call(data, "dependence")))) && (missing0 = "dependence"))) || (((data.computation === undefined) || (!(func0.call(data, "computation")))) && (missing0 = "computation"))){
validate50.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!((((((((key0 === "profileVersion") || (key0 === "kind")) || (key0 === "id")) || (key0 === "contextDigest")) || (key0 === "assessmentDigest")) || (key0 === "weights")) || (key0 === "dependence")) || (key0 === "computation"))){
validate50.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.profileVersion !== undefined && func0.call(data, "profileVersion")){
const _errs2 = errors;
if("comparison/0.1.0-draft.1" !== data.profileVersion){
validate50.errors = [{instancePath:instancePath+"/profileVersion",schemaPath:"#/$defs/version/const",keyword:"const",params:{allowedValue: "comparison/0.1.0-draft.1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.kind !== undefined && func0.call(data, "kind")){
const _errs4 = errors;
if("comparison-request" !== data.kind){
validate50.errors = [{instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "comparison-request"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined && func0.call(data, "id")){
let data2 = data.id;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern4.test(data2)){
validate50.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9._-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9._-]{0,63}$"+"\""}];
return false;
}
}
else {
validate50.errors = [{instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contextDigest !== undefined && func0.call(data, "contextDigest")){
let data3 = data.contextDigest;
const _errs8 = errors;
const _errs9 = errors;
if(errors === _errs9){
if(typeof data3 === "string"){
if(!pattern17.test(data3)){
validate50.errors = [{instancePath:instancePath+"/contextDigest",schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate50.errors = [{instancePath:instancePath+"/contextDigest",schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.assessmentDigest !== undefined && func0.call(data, "assessmentDigest")){
let data4 = data.assessmentDigest;
const _errs11 = errors;
const _errs12 = errors;
if(errors === _errs12){
if(typeof data4 === "string"){
if(!pattern17.test(data4)){
validate50.errors = [{instancePath:instancePath+"/assessmentDigest",schemaPath:"#/$defs/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate50.errors = [{instancePath:instancePath+"/assessmentDigest",schemaPath:"#/$defs/digest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.weights !== undefined && func0.call(data, "weights")){
let data5 = data.weights;
const _errs14 = errors;
if(errors === _errs14){
if(Array.isArray(data5)){
if(data5.length > 64){
validate50.errors = [{instancePath:instancePath+"/weights",schemaPath:"#/properties/weights/maxItems",keyword:"maxItems",params:{limit: 64},message:"must NOT have more than 64 items"}];
return false;
}
else {
if(data5.length < 1){
validate50.errors = [{instancePath:instancePath+"/weights",schemaPath:"#/properties/weights/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid5 = true;
const len0 = data5.length;
for(let i0=0; i0<len0; i0++){
const _errs16 = errors;
if(!(validate51(data5[i0], {instancePath:instancePath+"/weights/" + i0,parentData:data5,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate51.errors : vErrors.concat(validate51.errors);
errors = vErrors.length;
}
var valid5 = _errs16 === errors;
if(!valid5){
break;
}
}
}
}
}
else {
validate50.errors = [{instancePath:instancePath+"/weights",schemaPath:"#/properties/weights/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.dependence !== undefined && func0.call(data, "dependence")){
const _errs17 = errors;
if(!(validate55(data.dependence, {instancePath:instancePath+"/dependence",parentData:data,parentDataProperty:"dependence",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate55.errors : vErrors.concat(validate55.errors);
errors = vErrors.length;
}
var valid0 = _errs17 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.computation !== undefined && func0.call(data, "computation")){
let data8 = data.computation;
const _errs18 = errors;
const _errs20 = errors;
let valid7 = false;
let passing0 = null;
const _errs21 = errors;
if(errors === _errs21){
if(data8 && typeof data8 == "object" && !Array.isArray(data8)){
let missing1;
if(((data8.mode === undefined) || (!(func0.call(data8, "mode")))) && (missing1 = "mode")){
const err0 = {instancePath:instancePath+"/computation",schemaPath:"#/$defs/computation/oneOf/0/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
const _errs23 = errors;
for(const key1 of Object.keys(data8)){
if(!(key1 === "mode")){
const err1 = {instancePath:instancePath+"/computation",schemaPath:"#/$defs/computation/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
break;
}
}
if(_errs23 === errors){
if(data8.mode !== undefined && func0.call(data8, "mode")){
if("exact" !== data8.mode){
const err2 = {instancePath:instancePath+"/computation/mode",schemaPath:"#/$defs/computation/oneOf/0/properties/mode/const",keyword:"const",params:{allowedValue: "exact"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
}
}
}
else {
const err3 = {instancePath:instancePath+"/computation",schemaPath:"#/$defs/computation/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
var _valid0 = _errs21 === errors;
if(_valid0){
valid7 = true;
passing0 = 0;
var props1 = true;
}
const _errs25 = errors;
if(errors === _errs25){
if(data8 && typeof data8 == "object" && !Array.isArray(data8)){
let missing2;
if(((((data8.mode === undefined) || (!(func0.call(data8, "mode")))) && (missing2 = "mode")) || (((data8.algorithm === undefined) || (!(func0.call(data8, "algorithm")))) && (missing2 = "algorithm"))) || (((data8.samples === undefined) || (!(func0.call(data8, "samples")))) && (missing2 = "samples"))){
const err4 = {instancePath:instancePath+"/computation",schemaPath:"#/$defs/computation/oneOf/1/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
else {
const _errs27 = errors;
for(const key2 of Object.keys(data8)){
if(!(((key2 === "mode") || (key2 === "algorithm")) || (key2 === "samples"))){
const err5 = {instancePath:instancePath+"/computation",schemaPath:"#/$defs/computation/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
break;
}
}
if(_errs27 === errors){
if(data8.mode !== undefined && func0.call(data8, "mode")){
const _errs28 = errors;
if("monte-carlo" !== data8.mode){
const err6 = {instancePath:instancePath+"/computation/mode",schemaPath:"#/$defs/computation/oneOf/1/properties/mode/const",keyword:"const",params:{allowedValue: "monte-carlo"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var valid9 = _errs28 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data8.algorithm !== undefined && func0.call(data8, "algorithm")){
const _errs29 = errors;
if("xoshiro128ss-v1" !== data8.algorithm){
const err7 = {instancePath:instancePath+"/computation/algorithm",schemaPath:"#/$defs/computation/oneOf/1/properties/algorithm/const",keyword:"const",params:{allowedValue: "xoshiro128ss-v1"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
var valid9 = _errs29 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data8.samples !== undefined && func0.call(data8, "samples")){
let data12 = data8.samples;
const _errs30 = errors;
if(!(((typeof data12 == "number") && (!(data12 % 1) && !isNaN(data12))) && (isFinite(data12)))){
const err8 = {instancePath:instancePath+"/computation/samples",schemaPath:"#/$defs/computation/oneOf/1/properties/samples/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(errors === _errs30){
if((typeof data12 == "number") && (isFinite(data12))){
if(data12 > 100000 || isNaN(data12)){
const err9 = {instancePath:instancePath+"/computation/samples",schemaPath:"#/$defs/computation/oneOf/1/properties/samples/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100000},message:"must be <= 100000"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
else {
if(data12 < 100 || isNaN(data12)){
const err10 = {instancePath:instancePath+"/computation/samples",schemaPath:"#/$defs/computation/oneOf/1/properties/samples/minimum",keyword:"minimum",params:{comparison: ">=", limit: 100},message:"must be >= 100"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
}
var valid9 = _errs30 === errors;
}
else {
var valid9 = true;
}
}
}
}
}
}
else {
const err11 = {instancePath:instancePath+"/computation",schemaPath:"#/$defs/computation/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
var _valid0 = _errs25 === errors;
if(_valid0 && valid7){
valid7 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid7 = true;
passing0 = 1;
if(props1 !== true){
props1 = true;
}
}
}
if(!valid7){
const err12 = {instancePath:instancePath+"/computation",schemaPath:"#/$defs/computation/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
validate50.errors = vErrors;
return false;
}
else {
errors = _errs20;
if(vErrors !== null){
if(_errs20){
vErrors.length = _errs20;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
else {
validate50.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate50.errors = vErrors;
return errors === 0;
}
validate50.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate88(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate88.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.kit === undefined) || (!(func0.call(data, "kit")))) && (missing0 = "kit")) || (((data.context === undefined) || (!(func0.call(data, "context")))) && (missing0 = "context"))) || (((data.assessments === undefined) || (!(func0.call(data, "assessments")))) && (missing0 = "assessments"))) || (((data.request === undefined) || (!(func0.call(data, "request")))) && (missing0 = "request"))){
validate88.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 of Object.keys(data)){
if(!((((key0 === "kit") || (key0 === "context")) || (key0 === "assessments")) || (key0 === "request"))){
validate88.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.kit !== undefined && func0.call(data, "kit")){
const _errs2 = errors;
if(!(validate21(data.kit, {instancePath:instancePath+"/kit",parentData:data,parentDataProperty:"kit",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate21.errors : vErrors.concat(validate21.errors);
errors = vErrors.length;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.context !== undefined && func0.call(data, "context")){
const _errs3 = errors;
if(!(validate32(data.context, {instancePath:instancePath+"/context",parentData:data,parentDataProperty:"context",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate32.errors : vErrors.concat(validate32.errors);
errors = vErrors.length;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.assessments !== undefined && func0.call(data, "assessments")){
const _errs4 = errors;
if(!(validate36(data.assessments, {instancePath:instancePath+"/assessments",parentData:data,parentDataProperty:"assessments",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate36.errors : vErrors.concat(validate36.errors);
errors = vErrors.length;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.request !== undefined && func0.call(data, "request")){
const _errs5 = errors;
if(!(validate50(data.request, {instancePath:instancePath+"/request",parentData:data,parentDataProperty:"request",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate50.errors : vErrors.concat(validate50.errors);
errors = vErrors.length;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate88.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate88.errors = vErrors;
return errors === 0;
}
validate88.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};
