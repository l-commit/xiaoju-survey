import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SurveyConf } from 'src/models/surveyConf.entity';
import templateBase from '../template/surveyTemplate/templateBase.json';
import normalCode from '../template/surveyTemplate/survey/normal.json';
import npsCode from '../template/surveyTemplate/survey/nps.json';
import registerCode from '../template/surveyTemplate/survey/register.json';
import voteCode from '../template/surveyTemplate/survey/vote.json';
import { get } from 'lodash';
import moment from 'moment';

import { HttpException } from 'src/exceptions/httpException';
import { SurveyNotFoundException } from 'src/exceptions/surveyNotFoundException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { SurveySchemaInterface } from 'src/interfaces/survey';

const schemaDataMap = {
  normal: normalCode,
  nps: npsCode,
  register: registerCode,
  vote: voteCode,
};

@Injectable()
export class SurveyConfService {
  constructor(
    @InjectRepository(SurveyConf)
    private readonly surveyConfRepository: MongoRepository<SurveyConf>,
  ) {}

  private async getSchemaBySurveyType(surveyType: string) {
    // Implement your logic here
    const codeData = get(schemaDataMap, surveyType);
    if (!codeData) {
      throw new HttpException(
        '问卷类型不存在',
        EXCEPTION_CODE.SURVEY_TYPE_ERROR,
      );
    }
    const code = Object.assign({}, templateBase, codeData);
    const nowMoment = moment();
    code.baseConf.begTime = nowMoment.format('YYYY-MM-DD HH:mm:ss');
    code.baseConf.endTime = nowMoment
      .add(10, 'years')
      .format('YYYY-MM-DD HH:mm:ss');
    return code;
  }

  async createSurveyConf(params: {
    surveyId: string;
    surveyType: string;
    createMethod: string;
    createFrom: string;
  }) {
    const { surveyId, surveyType, createMethod, createFrom } = params;
    let schemaData = null;
    if (createMethod === 'copy') {
      const codeInfo = await this.getSurveyConfBySurveyId(createFrom);
      schemaData = codeInfo.code;
    } else {
      schemaData = await this.getSchemaBySurveyType(surveyType);
    }

    const newCode = this.surveyConfRepository.create({
      pageId: surveyId,
      code: schemaData,
    });

    return this.surveyConfRepository.save(newCode);
  }

  async getSurveyConfBySurveyId(surveyId: string) {
    const code = await this.surveyConfRepository.findOne({
      where: { pageId: surveyId },
    });
    if (!code) {
      throw new SurveyNotFoundException('问卷配置不存在');
    }
    return code;
  }

  async saveSurveyConf(params: {
    surveyId: string;
    schema: SurveySchemaInterface;
  }) {
    const codeInfo = await this.getSurveyConfBySurveyId(params.surveyId);
    if (!codeInfo) {
      throw new SurveyNotFoundException('问卷配置不存在');
    }
    codeInfo.code = params.schema;
    await this.surveyConfRepository.save(codeInfo);
  }

  async getSurveyContentByCode(codeInfo: SurveySchemaInterface) {
    const dataList = codeInfo.dataConf.dataList;
    const arr: Array<string> = [];
    for (const item of dataList) {
      arr.push(item.title);
      if (Array.isArray(item.options)) {
        for (const option of item.options) {
          arr.push(option.text);
        }
      }
    }
    return {
      text: arr.join('\n'),
    };
  }
}
