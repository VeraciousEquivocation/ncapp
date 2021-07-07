export const tempData = [
  {
      name: 'Countries',
      columns: [
          {
              name: 'region',
              makesUnique: false,
              isRegex: false,
          },
          {
              name: 'market',
              makesUnique: true,
              isRegex: false,
          },
      ],
      driveLookupName: 'regionmarket',
      allowedValues: [
          [
              'emea',
              'gbr',
              'great britain',
          ],
          [
              'emea',
              'ntd',
              'netherlands',
          ],
      ]
  },
]