import ActivityInstance from '../ActivityInstance.js'

export const createActivityInstance = (activityID, type, config) => {
  const t = String(type || 'Modelagem3D')
  if (t === 'Modelagem3D') {
    return new ActivityInstance(activityID, t, config, {
      quant: [
        { name: 'Acedeu à atividade', initial: false },
        { name: 'Download documento 1', initial: false },
        { name: 'Evolução pela atividade (%)', initial: '0.0' }
      ],
      qual: [
        { name: 'Student activity profile', urlTemplate: 'https://ActivityProvider/?APAnID={APAnID}' },
        { name: 'Actitivy Heat Map', urlTemplate: 'https://ActivityProvider/?APAnID={APAnID}' }
      ]
    })
  }
  if (t === 'AnaliseResultados') {
    return new ActivityInstance(activityID, t, config, {
      quant: [
        { name: 'Acedeu à atividade', initial: false },
        { name: 'Relatório gerado', initial: false },
        { name: 'Evolução pela atividade (%)', initial: '0.0' }
      ],
      qual: [
        { name: 'Resultados detalhados', urlTemplate: 'https://ActivityProvider/?APAnID={APAnID}' },
        { name: 'Mapa de calor', urlTemplate: 'https://ActivityProvider/?APAnID={APAnID}' }
      ]
    })
  }
  return new ActivityInstance(activityID, t, config, {
    quant: [
      { name: 'Acedeu à atividade', initial: false },
      { name: 'Evolução pela atividade (%)', initial: '0.0' }
    ],
    qual: [
      { name: 'Student activity profile', urlTemplate: 'https://ActivityProvider/?APAnID={APAnID}' }
    ]
  })
}

