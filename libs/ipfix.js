const TEMPLATE_SET_ID = 2;

class Ipfix {
  constructor(ipfixJson) {
    this.version = ipfixJson.version;
    this.length = ipfixJson.length;
    this.exportTime = ipfixJson.exportTime;
    this.seqNo = ipfixJson.seqNo;
    this.domainId = ipfixJson.domainId;
    this.templates = [];
    this.records = Ipfix.loadRecordsFromJson(ipfixJson);
    this.json = ipfixJson;
  }

  static loadTemplatesFromJson(ipfixJson){
    const sets = ipfixJson.sets;
    for(var i in sets){
      const set = sets[i];
      if(set.id != TEMPLATE_SET_ID){
        continue;
      }
      for(var j in set.templates){
        const template = set.templates[j];
      }
    }
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

  setLength(length){
    this.length = length;
  }

  setExportTime(exportTime){
    this.exportTime = exportTime;
  }

  setSeqNo(seqNo){
    this.seqNo = seqNo;
  }

  setDomainId(domainId){
    this.domainId = domainId;
  }

  addTemplate(template){
    this.templates.push(template);
  }

  addRecord(record){
    this.data.push(record);
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
