type _TRespCinfig = {
  [k: string]: {
    [k: string]: {
      code: string;
      msg: {
        en: string;
        th: string;
      };
    };
  };
};

export const ResponseConfig: _TRespCinfig = {
  common: {
    success: {
      code: '0',
      msg: {
        en: 'success',
        th: 'สำเร็จ',
      },
    },
  },
};

export const ExceptionConfig: _TRespCinfig = {
  common: {
    dataNotFound: {
      code: '000001',
      msg: {
        en: 'data not found',
        th: 'ไม่พบข้อมูล',
      },
    },
  },
};
