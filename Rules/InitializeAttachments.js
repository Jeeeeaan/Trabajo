/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function InitializeAttachments(formcellProxy) {

    var serviceName = '/GTAProyect/Services/MobilGTA.service';
    var entitySet = 'reporte';
    var queryOption = '$top=1'
    var promises = [];
    var attachmentData = [];
    return formcellProxy.read(serviceName, entitySet, [], queryOption).then(function (attachments) {
        attachments.forEach(function (attachmentObject) {
            var documentObject = attachmentObject.Document;
            var readLink = documentObject['@odata.readLink'];
            var entitySet = readLink.split('(')[0];
            promises.push(formcellProxy.isMediaLocal(serviceName, entitySet, readLink).then(function (isMediaLocal) {
                return [isMediaLocal, documentObject];
            }));
        });

        return Promise.all(promises).then(function (results) {
            results.forEach(function (result) {
                var isMedialLocal = result[0];
                var attachment = result[1];
                if (isMedialLocal && !attachment.FileSize) {
                    var entitySet = 'Documents';
                    var property = 'Document';
                    var readLink = attachment['@odata.readLink'];
                    var service = '/';
                    var documentPath = attachment.path;
                    var attachmentEntry = formcellProxy.createAttachmentEntry(documentPath, entitySet, property, readLink, service);
                    if (attachmentEntry) {
                        attachmentData.push(attachmentEntry);
                    }
                }
            });
            return attachmentData;
        });
    });
    
}
