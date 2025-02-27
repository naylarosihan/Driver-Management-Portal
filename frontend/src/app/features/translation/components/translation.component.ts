import { Component } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { PackageService } from '../../packages/services/package.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-translation',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './translation.component.html',
  styleUrl: './translation.component.scss'
})
export class TranslationComponent {
  textToTranslate: string = '';
  translatedText: string = '';
  selectedLanguage: string = 'en'; // Default to Spanish
  languages = [
    { language: 'English', code: 'en' },
    { language: 'Spanish', code: 'es' },
    { language: 'French', code: 'fr' },
    { language: 'German', code: 'de' },
    { language: 'Chinese (Simplified)', code: 'zh' },
    { language: 'Japanese', code: 'ja' },
    { language: 'Russian', code: 'ru' },
    { language: 'Italian', code: 'it' },
    { language: 'Portuguese', code: 'pt' },
    { language: 'Arabic', code: 'ar' },
    { language: 'Hindi', code: 'hi' }
  ];

  tableData: any = [
    {
      name: 'id',
      field: '_id',
      cell: (params: any) => params._id
    },
    {
      name: 'Title',
      field: 'package_title',
      cell: (params: any) => params.package_title
    },
    {
      name: 'Weight',
      field: 'package_weight',
      cell: (params: any) => params.package_weight + ' KG'
    },
    {
      name: 'Destination',
      field: 'package_destination',
      cell: (params: any) => params.package_destination
    },
    {
      name: 'Description',
      field: 'package_description',
      cell: (params: any) => params.package_description
    },
  ]

  translateTableData: any = [
    {
      name: 'Text',
      field: 'text',
      cell: (params: any) => params.text
    },
    {
      name: 'Target Language',
      field: 'target_language',
      cell: (params: any) => params.target_language
    },
    {
      name: 'Translation',
      field: 'translation',
      cell: (params: any) => params.translation
    }
  ]
  packageList: any = [];
  translationList: any = [];

  constructor(private translationService: TranslationService, private packageService: PackageService) { }

  translate(item: any) {
    this.translationService.translate(item?.package_description, this.selectedLanguage)
      .then(translatedText => { 
       const lang =  this.languages.filter((emt)=> emt?.code === this.selectedLanguage)
        this.translationList.push({
          text: item?.package_description,
          target_language: lang[0]?.language,
          translation: translatedText
        });
      })
      .catch(error => {
        console.error(error);
        this.translatedText = 'Translation failed';
      });
  }


  ngOnInit() {
    this.getAllPackageDetails()
  }

  getAllPackageDetails() {
    this.packageService.getAllPackages().subscribe((res) => {
      this.packageList = res
    }, error => {
      console.log(error)
    })
  }

}
