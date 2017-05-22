const DEFAULT_ENTREPRISE_NUMBER = 20763; // Louvain-la-Neuve

class InformationElement {
  constructor(name, id, eid) {
    this.name = name;
    this.id = id;
    this.eid = eid;
  }
}

module.exports = {
  // Standard
  OCTET_DELTA_COUNT: new InformationElement("octets", 1, 0),
  PACKET_DELTA_COUNT: new InformationElement("packets", 2, 0),

  // Entreprise specific (experimental for our thesis)
  SOURCE_NODE_ID: new InformationElement("src_node", 32770, DEFAULT_ENTREPRISE_NUMBER),
  DESTINATION_NODE_ID: new InformationElement("dst_node", 32771, DEFAULT_ENTREPRISE_NUMBER),
  PARENT: new InformationElement("parent", 32772, DEFAULT_ENTREPRISE_NUMBER),
  BATTERY: new InformationElement("battery", 32773, DEFAULT_ENTREPRISE_NUMBER),
};
