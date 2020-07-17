// eslint-disable-next-line
export const resolveLink = (type) => {
  switch (type) {
    case 'attack-pattern':
      return '/dashboard/techniques/attack_patterns';
    case 'course-of-action':
      return '/dashboard/techniques/courses_of_action';
    case 'tool':
      return '/dashboard/techniques/tools';
    case 'vulnerability':
      return '/dashboard/techniques/vulnerabilities';
    case 'sector':
      return '/dashboard/entities/sectors';
    case 'region':
      return '/dashboard/entities/regions';
    case 'country':
      return '/dashboard/entities/countries';
    case 'city':
      return '/dashboard/entities/cities';
    case 'organization':
      return '/dashboard/entities/organizations';
    case 'user':
      return '/dashboard/entities/individuals';
    case 'threat-actor':
      return '/dashboard/threats/threat_actors';
    case 'intrusion-set':
      return '/dashboard/threats/intrusion_sets';
    case 'campaign':
      return '/dashboard/threats/campaigns';
    case 'incident':
      return '/dashboard/threats/incidents';
    case 'malware':
      return '/dashboard/threats/malwares';
    case 'report':
      return '/dashboard/reports/all';
    case 'indicator':
      return '/dashboard/signatures/indicators';
    case 'observable':
    case 'autonomous-system':
    case 'domain':
    case 'ipv4-addr':
    case 'ipv6-addr':
    case 'url':
    case 'email-address':
    case 'email-subject':
    case 'mutex':
    case 'file':
    case 'file-name':
    case 'file-path':
    case 'file-md5':
    case 'file-sha1':
    case 'file-sha256':
    case 'pdb-path':
    case 'registry-key':
    case 'registry-key-value':
    case 'windows-service-name':
    case 'windows-service-display-name':
    case 'windows-scheduled-task':
    case 'x509-certificate-issuer':
    case 'x509-certificate-serial-number':
      return '/dashboard/signatures/observables';
    default:
      return null;
  }
};
