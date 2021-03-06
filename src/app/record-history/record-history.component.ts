/*
 * This file is part of record-editor.
 * Copyright (C) 2017 CERN.
 *
 * record-editor is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * record-editor is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with record-editor; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { RecordApiService } from '../shared/services';
import { RecordRevision } from '../shared/interfaces';


@Component({
  selector: 're-record-history',
  templateUrl: './record-history.component.html',
  styleUrls: [
    './record-history.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordHistoryComponent implements OnInit {

  @Output() revisionChange = new EventEmitter<Object>();
  @Output() revisionRevert = new EventEmitter<void>();

  revisions: Array<RecordRevision>;
  selectedRevision: RecordRevision;

  constructor(private apiService: RecordApiService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.fetchRevisions();
  }

  onRevisionClick(revision: RecordRevision) {
    this.selectedRevision = revision;
    this.apiService
      .fetchRevisionData(revision.transaction_id, revision.rec_uuid)
      .then(revisionData => this.revisionChange.emit(revisionData));
  }

  onCurrentRevisionClick() {
    this.selectedRevision = undefined;
    this.revisionChange.emit();
  }

  onRevertClick() {
    this.apiService
      .revertToRevision(this.selectedRevision.revision_id)
      .then(() => {
        this.selectedRevision = undefined;
        this.revisionRevert.emit();
        this.fetchRevisions();
      });
  }

  private fetchRevisions() {
    this.apiService
      .fetchRevisions()
      .then(revisions => {
        this.revisions = revisions;
        this.changeDetectorRef.markForCheck();
      });
  }
}
