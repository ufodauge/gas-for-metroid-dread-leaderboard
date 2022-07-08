function authUser(authinfo: AuthInfo, header?: any[], table?: any[][]): [boolean, UserInfo?] {
    const identifier: string = authinfo.identifier;
    const password: string = authinfo.password;

    if (header === undefined) {
        const sheet = SpreadsheetApp.openById(SHEET_ID_USER).getSheets()[0];

        header = sheet.getDataRange().getValues().slice(0, 1)[0];
        table = sheet.getDataRange().getValues().slice(1);
    }

    const SHEET_USER_ID_LABEL_INDEX = header.indexOf(SHEET_USER_ID_LABEL);
    const SHEET_USER_PASSWORD_LABEL_INDEX = header.indexOf(SHEET_USER_PASSWORD_LABEL);

    let infoRow = null;

    // 識別子がメールアドレスかどうかで行を取得
    if (MAILADDRESS_REGEX.test(identifier)) {
        infoRow = table.find(row => row[SHEET_USER_MAIL_LABEL_INDEX] === identifier);
    } else {
        infoRow = table.find(row => row[SHEET_USER_ID_LABEL_INDEX] === identifier);
    }

    if (infoRow === undefined) {
        return [false]
    }

    const passwordHashed = convertDataToSha256Hash(password, PASSWORD_STRETCHING_TIMES, identifier);
    if (infoRow[SHEET_USER_PASSWORD_LABEL_INDEX] !== passwordHashed) {
        return [false]
    }

    const SHEET_USER_NAME_LABEL_INDEX = header.indexOf(SHEET_USER_NAME_LABEL);
    const SHEET_USER_NAME_JP_LABEL_INDEX = header.indexOf(SHEET_USER_NAME_JP_LABEL);
    const SHEET_USER_MAIL_LABEL_INDEX = header.indexOf(SHEET_USER_MAIL_LABEL);

    const info: UserInfo = {
        id: infoRow[SHEET_USER_ID_LABEL_INDEX],
        name: infoRow[SHEET_USER_NAME_LABEL_INDEX],
        nameJp: infoRow[SHEET_USER_NAME_JP_LABEL_INDEX],
        mail: infoRow[SHEET_USER_MAIL_LABEL_INDEX],
        password: password
    }

    return [true, info]
}