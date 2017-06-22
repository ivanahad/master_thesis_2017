const InfoElem = require('../libs/informationElements');

const TEMPLATE_SET_ID = 2;

class Ipfix {
  constructor(ipfixJson) {
    this.version = ipfixJson.version;
    this.length = ipfixJson.length;
    this.exportTime = ipfixJson.exportTime;
    this.seqNo = ipfixJson.seqNo;
    this.domainId = ipfixJson.domainId;
    this.templates = Ipfix.loadTemplatesFromJson(ipfixJson);
    this.records = Ipfix.loadRecordsFromJson(ipfixJson);
    this.json = ipfixJson;
  }

  addTemplate(template){
    this.templates.push(template);
  }

  addRecord(record){
    this.data.push(record);
  }

  getValues(){
    var listInfoElem = arguments;
    var values = [];
    for(var i in this.records){
      const record = this.records[i];

      var result = {};
      for(var j in record.fields){
        const field = record.fields[j];
        const infoElem = Ipfix.matchInfoElements(listInfoElem, field);
        if(infoElem !== null){
          result[infoElem.name] = field.value;
        }
      }

      if(Object.keys(result).length == listInfoElem.length){
        result.exportTime = this.exportTime;
        values.push(result);
      }

    }
    return values;
  }

  static loadTemplatesFromJson(ipfixJson){
    const templates = [];
    const sets = ipfixJson.sets;
    for(var i in sets){

      const set = sets[i];
      if(set.id != TEMPLATE_SET_ID){
        continue;
      }
      for(var j in set.templates){

        const template = set.templates[j];
        var templateObj = new Template(template.id);

        for(var k in template.elements){

          const field = template.elements[k];
          templateObj.addField(field.id, field.length, field.eid);
        }
        templates.push(templateObj);
      }
    }
    return templates;
  }

  static loadRecordsFromJson(ipfixJson){
    const sets = ipfixJson.sets;
    var records = [];
    for(var i in sets){

      const set = sets[i];
      if(set.id == TEMPLATE_SET_ID){
        continue;
      }
      for(var j in set.data){

        var recordObj = new Record(set.id);
        const record = set.data[j];
        for(var k in record){

          const field = record[k];
          recordObj.addField(field.id, field.value, field.eid);
        }
        records.push(recordObj);
      }
    }
    return records;
  }

  static matchInfoElements(listInfoElem, field){
    for(var i in listInfoElem){
      const infoElem = listInfoElem[i];
      if(Ipfix.matchInfoElement(infoElem, field)){
        return infoElem;
      }
    }
    return null;
  }

  static matchInfoElement(infoElem, field){
    return infoElem.id == field.id && infoElem.eid == field.eid;
  }
}

class Template {
  constructor(id) {
    this.id = id;
    this.fields = [];
  }

  addField(id, length, eid){
    const field = {
      id: id,
      length: length,
      eid: eid
    };
    this.fields.push(field);
  }
}


class Record {
  constructor(templateId) {
    this.templateId = templateId;
    this.fields = [];
  }

  addField(id, value, eid){
    const field = {
      id: id,
      value: value,
      eid: eid
    };
    this.fields.push(field);
  }
}

module.exports = Ipfix;
