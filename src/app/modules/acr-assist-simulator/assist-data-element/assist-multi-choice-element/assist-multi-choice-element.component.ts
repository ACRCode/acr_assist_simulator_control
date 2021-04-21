import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { MultiChoiceDataElement } from 'testruleengine/Library/Models/Class';
import { MultiChoiceElement } from '../assist-data-element.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectedCondition } from '../../../core/models/executed-result.model';
import { UtilityService } from '../../../core/services/utility.service';
import { SubscriptionLike as ISubscription } from 'rxjs';

const $ = require('jquery');
import * as _ from 'lodash';
import { forEach } from 'lodash';
declare var triggerToolTip: any;

@Component({
  selector: 'acr-assist-multi-choice-element',
  templateUrl: './assist-multi-choice-element.component.html',
  styleUrls: ['./assist-multi-choice-element.component.css', '../../styles.css']
})
export class AssistMultiChoiceElementComponent implements OnInit, AfterViewInit, OnDestroy {

  multiElements: MultiChoiceElement[] = [];
  multiChoiceValues: string[] = [];
  multiChoiceComaprisonValues: string[] = [];
  multiChoiceElementForm: FormGroup;
  selectedCondition: SelectedCondition;
  isFreeText = false;
  freeTextValue: string;
  simulatorStateSubscription: ISubscription;

  @Input() alignLabelAndControlToTopAndBottom: boolean;
  @Input() assetsBaseUrl: string;
  @Input() multiChoiceElement: MultiChoiceDataElement;
  @Output() returnMultiChoice = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.createMultiChoiceElementForm();
    const $this = this;
    // setTimeout(function (e) {
    $(document).on('change', 'input:checkbox', function () {
      if ($(this).prop('checked') === true) {
        // Only remove the class in the specific `box` that contains the radio
        $('label.highlightchoice').removeClass('highlightchoice');
        // $('div.highlightchoice').removeClass('highlightchoice');
        $(this).closest('.div_options_withthumbnail').addClass('highlightchoice');
      } else {
        $(this).closest('.div_options_withthumbnail').removeClass('highlightchoice');
      }
    });

    $this.showImageZoom();
    // }, 200);


    $(document).on('click', '.div_multi_img_thumbnail', function (e) {
      const modal = document.getElementById('immgModalmulti');
      const modalImg = document.getElementById('img01multi') as any;
      let img = $(this).find('img');
      let img_src = img.attr('src');
      if (img_src === '') {
        img_src = undefined;
      }
      let img_label = img.attr('id');
      modal.style.display = 'block';
      modalImg.src = img_src;
      var caption = document.getElementsByClassName('captionmutli');
      for (var i = 0; i < caption.length; i++) {
        caption[i].innerHTML = img_label;
      }
      // caption.forEach(element => {
      //   element.innerHTML = img_label;
      // });
      // caption[caption.length - 1].innerHTML = img_label;
    });
  }

  isValidImageURL(location: string) {
    return this.utilityService.isValidImageURL(location) || this.utilityService.isImageDataUrl(location);
  }

  showImageZoom() {
    const utility = this.utilityService;
    $(document).on('mouseover', '.div_multi_img_thumbnail', function (e) {
      const _image = $(this).find('img');
      if (utility.isValidInstance(_image)) {
        const img_src = _image[0].src;
        let tooltip = '<div class="tooltiptopicevent" style="width: auto;height: auto;background: white;position: absolute;z-index: 10001;padding: 1px 1px 1px 1px;line-height: 200%;-webkit-box-shadow: 6px 5px 5px -5px #ccc!important;-moz-0box-shadow: 6px 5px 5px -5px #ccc!important;box-shadow: 6px 5px 5px -5px #ccc!important;box-shadow: 6px 5px 5px -5px #ccc!important;background-color: #000000">';
        tooltip += '<div class="imageContainer"><div>';
        tooltip += '<img style="width: 250px;height: 250px;object-fit: contain;" src="' + img_src + '" />';
        tooltip += '</div>';
        tooltip += '</div></div>';

        if ($('div').hasClass('tooltiptopicevent')) {
          $('.tooltiptopicevent').remove();
        }

        $('body').append(tooltip);
        // $('.div_multi_img_thumbnail').css('z-index', 1000000);
        $('.tooltiptopicevent').fadeIn('500');
        $('.tooltiptopicevent').fadeTo('10', 1.9);
      }
    });
    $(document).on('mousemove', '.div_multi_img_thumbnail', function (e) {
      // .mousemove(function (e) {
      // $('.tooltiptopicevent').css('top', e.pageY + 10);
      $('.tooltiptopicevent').css('top', e.pageY - 250);
      $('.tooltiptopicevent').css('left', e.pageX + -300);
      // $('.tooltiptopicevent').css('right', e.pageX);
    });

    $(document).on('mouseleave', '.div_multi_img_thumbnail', function (e) {
      // .mouseleave(function (e) {
      $('.div_multi_img_thumbnail').css('z-index', 8);
      $('.tooltiptopicevent').remove();
    });
  }

  ngOnDestroy() {
    if (this.utilityService.isValidInstance(this.simulatorStateSubscription)) {
      this.simulatorStateSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    const $this = this;
    setTimeout(function (e) {
      $this.showOrHideFreeText($this.multiChoiceElement.id, '', false);
      if ($this.multiChoiceElement.currentValue !== undefined) {
        const values: any = [];
        const labels: any = [];
        for (const choice in $this.multiChoiceElement.choiceInfo) {
          if (Array.isArray($this.multiChoiceElement.currentValue)) {
            for (const currValue of $this.multiChoiceElement.currentValue) {
              // tslint:disable-next-line:max-line-length
              if (currValue === $this.multiChoiceElement.choiceInfo[choice].value && $this.multiChoiceElement.choiceInfo[choice].value !== undefined) {
                $('#' + $this.multiChoiceElement.id + '_' + $this.multiChoiceElement.choiceInfo[choice].value).prop('checked', true);
                values.push(currValue);
                labels.push($this.multiChoiceElement.choiceInfo[choice].label);
                break;
              }
            }
          } else {
            // tslint:disable-next-line:max-line-length
            if ($this.multiChoiceElement.currentValue === $this.multiChoiceElement.choiceInfo[choice].value && $this.multiChoiceElement.choiceInfo[choice].value !== undefined) {
              $('#' + $this.multiChoiceElement.id + '_' + $this.multiChoiceElement.currentValue).prop('checked', true);
              values.push($this.multiChoiceElement.currentValue);
              labels.push($this.multiChoiceElement.choiceInfo[choice].label);
            }
          }
        }
        $this.selectedMultiChoice($this.multiChoiceElement.id, $this.multiChoiceElement.label, values, labels);
      } else {
        $this.returnMultiChoice.emit(undefined);
      }
    });

    triggerToolTip();
  }

  isChoiceChecked(choice) {
    return;
  }

  selectedMultiChoice(elementId: string, selectedCondition: string, choiceValue: any, choiceLabel: any) {
    const multiElement = new MultiChoiceElement();
    if ($('#' + elementId + '_' + choiceValue).is(':checked')) {
      this.multiChoiceComaprisonValues = choiceValue;
    } else {
      const index = this.multiChoiceValues.indexOf(choiceLabel);
      const comparisonIndex = this.multiChoiceComaprisonValues.indexOf(choiceValue);
      if (index > -1) {
        this.multiChoiceValues.splice(index, 1);
      }
      if (comparisonIndex > -1) {
        this.multiChoiceComaprisonValues.splice(comparisonIndex, 1);
      }
    }

    setTimeout(() => {
      const selectedValues = this.getSelectedItems();
      const selectedTexts = this.getSelectedItemTexts(selectedValues);

      multiElement.elementId = elementId;
      multiElement.selectedValues = selectedValues;
      multiElement.selectedTexts = selectedTexts;

      this.selectedCondition = new SelectedCondition();
      this.selectedCondition.selectedConditionId = elementId;
      this.selectedCondition.selectedCondition = selectedCondition;
      this.selectedCondition.selectedValue = selectedValues;
      this.returnMultiChoice.emit({ receivedElement: multiElement, selectedCondition: this.selectedCondition });
    });
  }

  choiceSelected(elementId: string, selectedElement: string, selectedText: string, selectedValue: string, event) {
    if (event.target.checked) {
      this.showOrHideFreeText(elementId, selectedValue, true);
    } else {
      $('#txt_other_' + this.multiChoiceElement.id).val('');
      this.freeTextValue = '';
      this.showOrHideFreeText(elementId, selectedValue, false);
    }

    this.updateMultiChoice(elementId, selectedElement, this.freeTextValue, event);
  }

  updateFreeText(element, elementId, selectedCondition) {
    const selectedValues = this.getSelectedItems();
    const selectedTexts = this.getSelectedItemTexts(selectedValues);

    const multiElement = new MultiChoiceElement();
    multiElement.elementId = elementId;
    multiElement.selectedValues = selectedValues;
    multiElement.selectedTexts = selectedTexts;

    this.selectedCondition = new SelectedCondition();
    this.selectedCondition.selectedConditionId = elementId;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = selectedValues;
    this.returnMultiChoice.emit({ receivedElement: multiElement, selectedCondition: this.selectedCondition });
  }

  updateMultiChoice(elementId: string, selectedCondition: string, value: string, event) {
    const multiElement = new MultiChoiceElement();
    if (event.currentTarget !== undefined && event.currentTarget.checked) {
      if (value !== '') {
        if (this.multiChoiceValues.indexOf(value) === -1) {
          this.multiChoiceValues.push(value);
        }
        if (this.multiChoiceComaprisonValues.indexOf(value) === -1) {
          this.multiChoiceComaprisonValues.push(event.currentTarget.value);
        }
      }
    } else {
      const index = this.multiChoiceValues.indexOf(value);
      const comparisonIndex = this.multiChoiceComaprisonValues.indexOf(event.currentTarget.value);
      if (index > -1) {
        this.multiChoiceValues.splice(index, 1);
      }
      if (comparisonIndex > -1) {
        this.multiChoiceComaprisonValues.splice(comparisonIndex, 1);
      }
    }

    const selectedValues = this.getSelectedItems();
    const selectedTexts = this.getSelectedItemTexts(selectedValues);

    multiElement.elementId = elementId;
    multiElement.selectedValues = selectedValues;
    multiElement.selectedTexts = selectedTexts;

    this.selectedCondition = new SelectedCondition();
    this.selectedCondition.selectedConditionId = elementId;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = selectedValues;
    this.returnMultiChoice.emit({ receivedElement: multiElement, selectedCondition: this.selectedCondition });
  }

  private getSelectedItems() {
    const items = document.getElementsByClassName('multiselectItems_' + this.multiChoiceElement.id) as any;
    const selectedItems = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < items.length; i++) {
      if (items[i].checked === true) {
        selectedItems.push(items[i].value);
      }
    }

    let selectedValues = selectedItems;
    if ($('#txt_other_' + this.multiChoiceElement.id).val() !== '') {
      selectedValues.push($('#txt_other_' + this.multiChoiceElement.id).val());
    }

    if (selectedValues !== undefined && this.multiChoiceElement.ChoiceNotRelevant !== undefined) {
      const filteredItems = selectedValues.filter((item: any) => !this.multiChoiceElement.ChoiceNotRelevant.includes(item));
      selectedValues = filteredItems;
    }

    return selectedValues;
  }

  private getSelectedItemTexts(selectedValues: any) {
    const selectedItems = [];
    for (const value of selectedValues) {
      const choice = this.multiChoiceElement.choiceInfo.find(x => x.value === value);
      if (this.utilityService.isValidInstance(choice)) {
        selectedItems.push(choice.label);
      } else {
        selectedItems.push(value);
      }
    }

    return selectedItems;
  }

  isMultiChoiceElementRequired(): boolean {
    return this.multiChoiceElementForm.controls.multiCheckBox.invalid &&
      this.multiChoiceElement.isRequired && !this.multiChoiceValues.length;
  }

  isMultiChoiceLabelHidden(value: string): boolean {
    if (this.multiChoiceElement.currentValue !== undefined && this.multiChoiceElement.ChoiceNotRelevant !== undefined &&
      Array.isArray(this.multiChoiceElement.currentValue)) {
      const filteredItems = this.multiChoiceElement.currentValue.filter(
        (item: any) => !this.multiChoiceElement.ChoiceNotRelevant.includes(item));
      this.multiChoiceElement.currentValue = filteredItems;
    }

    // #region uncomment
    if (this.utilityService.isNotEmptyArray(this.multiChoiceElement.ChoiceNotRelevant) &&
      this.multiChoiceElement.ChoiceNotRelevant.indexOf(value) > -1) {
      $('#' + this.multiChoiceElement.id + '_' + value).prop('checked', false);
    }

    // $('input:checkbox').trigger('change');

    return this.multiChoiceElement.ChoiceNotRelevant !== undefined ?
      this.multiChoiceElement.ChoiceNotRelevant.indexOf(value) > -1 ? true : null
      : null;
  }

  showOrHideFreeText(elementId: string, selectedValue: string, isChecked) {
    if (selectedValue === 'freetext' && isChecked) {
      $('#div_' + elementId + '_other').show();
      if (selectedValue === 'freetext') {
        this.freeTextValue = $('#txt_other_' + this.multiChoiceElement.id).val();
      }
    } else if (!isChecked) {
      $('#div_' + elementId + '_other').hide();
      this.freeTextValue = '';
      this.isFreeText = false;
    }
  }

  private createMultiChoiceElementForm() {
    this.multiChoiceElementForm = this.formBuilder.group({
      multiCheckBox: ['', Validators.required],
    }, {
      validator: this.specificValueInsideRange('multiCheckBox')
    });
  }

  private specificValueInsideRange(multiCheckBox: string) {
    return (group: FormGroup) => {
      const choiceControl = group.controls.multiCheckBox;
      if (this.multiChoiceElement.isRequired) {
        return choiceControl.setErrors({ notEquivalent: true });
      } else {
        return choiceControl.setErrors(null);
      }
    };
  }


  onImgModelClick(event) {
    if (event.target.tagName !== 'IMG') {
      this.onImgPopupClose();
    }
  }

  // onChoiceDiagramClick(choice, event) {
  //   const modal = document.getElementById('immgModalmulti');
  //   const modalImg = document.getElementById('img01multi') as any;
  //   const img_src = event.target.src;
  //   modal.style.display = 'block';
  //   modalImg.src = img_src;
  //   // modalImg.src = 'https://images.pexels.com/photos/4350202/pexels-photo-4350202.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';  ///img_src;
  // }

  onChoiceDiagramClick(choice, event, diagram) {
    // var src = $(event).find('img').attr('src');
    // const modal = document.getElementById('immgModal');
    // const modalImg = document.getElementById('img01') as any;
    // // const img_src = event.target.src;
    // let img_src = undefined;
    // if (this.isValidImageURL(diagram.location)) {
    //   img_src = diagram.location;
    // } else {
    //   img_src = this.getImageDataUrl(diagram.location);
    // }

    // modal.style.display = 'block';
    // modalImg.src = img_src;
    // modalImg.src = 'https://images.pexels.com/photos/7102/notes-macbook-study-conference.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';  ///img_src;
  }

  isChoiceHasDiagrams(multiChoiceElement: MultiChoiceElement) {
    const multiChoiceElementWithDigrams = this.multiChoiceElement.choiceInfo.filter(x => this.utilityService.isNotEmptyArray(x.diagrams));
    return this.utilityService.isNotEmptyArray(multiChoiceElementWithDigrams) ? true : false;
  }

  getImageDataUrl(label: string): string {
    if (this.utilityService.isNotEmptyString(label)) {
      if (this.utilityService.isImageDataUrl(label)) {
        return label;
      } else if (this.utilityService.isValidInstance(this.assetsBaseUrl)) {
        return `${this.assetsBaseUrl}/${label}`;
      }
    }
  }

  onImgPopupClose() {
    const modal = document.getElementById('immgModalmulti');
    modal.style.display = 'none';
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.onImgPopupClose();
  }
}
